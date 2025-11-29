package com.Ebiz.risk.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.widget.doAfterTextChanged
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.Ebiz.risk.R
import com.Ebiz.risk.databinding.FragmentProjectInputBinding
import com.Ebiz.risk.viewmodel.RiskViewModel

class ProjectInputFragment : Fragment() {
    private var _binding: FragmentProjectInputBinding? = null
    private val binding get() = _binding!!
    private val viewModel: RiskViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProjectInputBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupValidation()
        setupSubmitButton()
    }

    private fun setupValidation() {
        binding.etTitle.doAfterTextChanged { validateForm() }
        binding.etDescription.doAfterTextChanged { validateForm() }
        binding.etBudget.doAfterTextChanged { validateForm() }
    }

    private fun validateForm() {
        val title = binding.etTitle.text?.toString()?.trim() ?: ""
        val description = binding.etDescription.text?.toString()?.trim() ?: ""
        val budget = binding.etBudget.text?.toString()?.trim() ?: ""

        binding.btnSubmit.isEnabled = title.isNotEmpty()
            && description.isNotEmpty()
            && budget.isNotEmpty()
            && budget.toDoubleOrNull() != null
            && budget.toDouble() > 0
    }

    private fun setupSubmitButton() {
        binding.btnSubmit.setOnClickListener {
            val title = binding.etTitle.text?.toString()?.trim() ?: ""
            val description = binding.etDescription.text?.toString()?.trim() ?: ""
            val budgetStr = binding.etBudget.text?.toString()?.trim() ?: ""
            val budget = budgetStr.toDoubleOrNull() ?: 0.0

            if (title.isEmpty() || description.isEmpty() || budget <= 0) {
                Toast.makeText(context, "모든 필드를 올바르게 입력해주세요", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // ViewModel에 프로젝트 생성
            viewModel.createNewProject(title, description, budget)

            // 리스크 입력 화면으로 이동
            findNavController().navigate(R.id.action_projectInput_to_riskInput)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

