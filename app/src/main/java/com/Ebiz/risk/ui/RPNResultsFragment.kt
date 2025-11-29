package com.Ebiz.risk.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.Ebiz.risk.R
import com.Ebiz.risk.databinding.FragmentRpnResultsBinding
import com.Ebiz.risk.ui.adapter.RiskAdapter
import com.Ebiz.risk.viewmodel.RiskViewModel

class RPNResultsFragment : Fragment() {
    private var _binding: FragmentRpnResultsBinding? = null
    private val binding get() = _binding!!
    private val viewModel: RiskViewModel by activityViewModels()
    private lateinit var riskAdapter: RiskAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRpnResultsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        observeViewModel()
        setupButtons()
    }

    private fun setupRecyclerView() {
        riskAdapter = RiskAdapter()
        binding.rvRisks.apply {
            adapter = riskAdapter
            layoutManager = LinearLayoutManager(context)
        }
    }

    private fun observeViewModel() {
        viewModel.currentProject.observe(viewLifecycleOwner) { project ->
            project?.let {
                // 실패 확률 표시
                binding.tvFailureProbability.text = String.format("%.1f%%", it.failureProbability)
                binding.probabilityProgress.progress = it.failureProbability.toInt()

                // 위험도 레벨 표시
                val riskLevel = getRiskLevel(it.failureProbability)
                binding.tvRiskLevel.text = riskLevel.first
                binding.tvRiskLevel.setBackgroundColor(riskLevel.second)

                // 총 RPN
                binding.tvTotalRpn.text = it.totalRPN.toString()

                // 예상 손실
                binding.tvEstimatedLoss.text = it.estimatedLoss.toInt().toString()
            }
        }

        viewModel.currentRisks.observe(viewLifecycleOwner) { risks ->
            // RPN 순으로 정렬하여 표시
            riskAdapter.submitList(risks.sortedByDescending { it.rpn })
        }
    }

    private fun getRiskLevel(probability: Double): Pair<String, Int> {
        return when {
            probability >= 70 -> Pair("매우 높음", android.graphics.Color.parseColor("#F44336"))
            probability >= 50 -> Pair("높음", android.graphics.Color.parseColor("#FF9800"))
            probability >= 30 -> Pair("보통", android.graphics.Color.parseColor("#FFC107"))
            else -> Pair("낮음", android.graphics.Color.parseColor("#4CAF50"))
        }
    }

    private fun setupButtons() {
        binding.btnViewActions.setOnClickListener {
            Toast.makeText(context, "AI 실행 조언 기능은 추후 구현 예정입니다", Toast.LENGTH_SHORT).show()
        }

        binding.btnSaveProject.setOnClickListener {
            viewModel.saveProject { projectId ->
                Toast.makeText(context, "프로젝트가 저장되었습니다", Toast.LENGTH_SHORT).show()
                findNavController().navigate(R.id.action_rpnResults_to_home)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

