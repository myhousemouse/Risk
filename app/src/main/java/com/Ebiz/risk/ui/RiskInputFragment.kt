package com.Ebiz.risk.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.Ebiz.risk.R
import com.Ebiz.risk.databinding.FragmentRiskInputBinding
import com.Ebiz.risk.model.Risk
import com.Ebiz.risk.viewmodel.RiskViewModel
import com.google.android.material.slider.Slider

class RiskInputFragment : Fragment() {
    private var _binding: FragmentRiskInputBinding? = null
    private val binding get() = _binding!!
    private val viewModel: RiskViewModel by activityViewModels()

    private var occurrence = 5
    private var severity = 5
    private var detection = 5

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRiskInputBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        observeViewModel()
        setupSliders()
        setupButtons()
    }

    private fun observeViewModel() {
        viewModel.currentRiskIndex.observe(viewLifecycleOwner) { index ->
            val risk = viewModel.getCurrentRisk()
            risk?.let { updateUI(it, index) }
        }

        viewModel.currentRisks.observe(viewLifecycleOwner) { risks ->
            val index = viewModel.currentRiskIndex.value ?: 0
            binding.progressBar.max = risks.size
            binding.progressBar.progress = index + 1
            binding.tvProgress.text = "${index + 1}/${risks.size}"
        }
    }

    private fun updateUI(risk: Risk, index: Int) {
        val risks = viewModel.currentRisks.value ?: return

        // 진행률 업데이트
        binding.progressBar.progress = index + 1
        binding.tvProgress.text = "${index + 1}/${risks.size}"

        // 리스크 정보 표시
        binding.tvRiskName.text = risk.name
        binding.tvRiskDescription.text = risk.description

        // 슬라이더 값 설정
        occurrence = risk.occurrence
        severity = risk.severity
        detection = risk.detection

        binding.sliderOccurrence.value = occurrence.toFloat()
        binding.sliderSeverity.value = severity.toFloat()
        binding.sliderDetection.value = detection.toFloat()

        updateRPN()

        // 버튼 상태
        binding.btnPrevious.isEnabled = index > 0

        // 마지막 리스크인 경우 버튼 텍스트 변경
        if (index == risks.size - 1) {
            binding.btnNext.text = "분석 완료"
            binding.btnNext.icon = resources.getDrawable(android.R.drawable.ic_menu_send, null)
        } else {
            binding.btnNext.text = "다음 리스크"
            binding.btnNext.icon = resources.getDrawable(android.R.drawable.ic_media_next, null)
        }
    }

    private fun setupSliders() {
        binding.sliderOccurrence.addOnChangeListener { _, value, _ ->
            occurrence = value.toInt()
            binding.tvOccurrenceValue.text = occurrence.toString()
            updateRPN()
        }

        binding.sliderSeverity.addOnChangeListener { _, value, _ ->
            severity = value.toInt()
            binding.tvSeverityValue.text = severity.toString()
            updateRPN()
        }

        binding.sliderDetection.addOnChangeListener { _, value, _ ->
            detection = value.toInt()
            binding.tvDetectionValue.text = detection.toString()
            updateRPN()
        }
    }

    private fun updateRPN() {
        val rpn = occurrence * severity * detection
        binding.tvRpnValue.text = rpn.toString()
    }

    private fun setupButtons() {
        binding.btnPrevious.setOnClickListener {
            // 현재 값 저장
            viewModel.updateRiskScores(occurrence, severity, detection)
            viewModel.moveToPreviousRisk()
        }

        binding.btnNext.setOnClickListener {
            // 현재 값 저장
            viewModel.updateRiskScores(occurrence, severity, detection)

            val currentIndex = viewModel.currentRiskIndex.value ?: 0
            val totalRisks = viewModel.currentRisks.value?.size ?: 0

            if (currentIndex < totalRisks - 1) {
                // 다음 리스크로
                viewModel.moveToNextRisk()
            } else {
                // 분석 완료 - RPN 결과 화면으로
                viewModel.completeRiskAnalysis()
                findNavController().navigate(R.id.action_riskInput_to_rpnResults)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

