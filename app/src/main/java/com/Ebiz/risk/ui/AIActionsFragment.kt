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
import com.Ebiz.risk.databinding.FragmentAiActionsBinding
import com.Ebiz.risk.viewmodel.RiskViewModel

class AIActionsFragment : Fragment() {
    private var _binding: FragmentAiActionsBinding? = null
    private val binding get() = _binding!!
    private val viewModel: RiskViewModel by activityViewModels()
    private lateinit var adapter: AIActionsAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAiActionsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupObservers()
        setupButtons()

        // AI Actions 생성
        viewModel.generateAIActions()
    }

    private fun setupRecyclerView() {
        adapter = AIActionsAdapter()
        binding.rvActions.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@AIActionsFragment.adapter
        }
    }

    private fun setupObservers() {
        viewModel.aiActions.observe(viewLifecycleOwner) { actions ->
            adapter.submitList(actions)
            binding.progressBar.visibility = View.GONE
            binding.rvActions.visibility = View.VISIBLE
        }

        viewModel.isLoadingAI.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.btnNext.isEnabled = !isLoading
        }

        viewModel.aiError.observe(viewLifecycleOwner) { error ->
            error?.let {
                Toast.makeText(context, it, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun setupButtons() {
        binding.btnNext.setOnClickListener {
            findNavController().navigate(R.id.action_aiActions_to_rpnResults)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

