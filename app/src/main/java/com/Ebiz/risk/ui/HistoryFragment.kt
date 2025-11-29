package com.Ebiz.risk.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.Ebiz.risk.databinding.FragmentHistoryBinding
import com.Ebiz.risk.ui.adapter.ProjectAdapter
import com.Ebiz.risk.viewmodel.RiskViewModel
import kotlinx.coroutines.launch

class HistoryFragment : Fragment() {
    private var _binding: FragmentHistoryBinding? = null
    private val binding get() = _binding!!
    private val viewModel: RiskViewModel by activityViewModels()
    private lateinit var projectAdapter: ProjectAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHistoryBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupToolbar()
        setupRecyclerView()
        observeProjects()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationIcon(android.R.drawable.ic_menu_close_clear_cancel)
        binding.toolbar.setNavigationOnClickListener {
            findNavController().popBackStack()
        }
    }

    private fun setupRecyclerView() {
        projectAdapter = ProjectAdapter(
            onItemClick = { project ->
                // 프로젝트 상세 보기 (추후 구현)
            },
            onDeleteClick = { project ->
                viewModel.deleteProject(project) {
                    // 삭제 완료
                }
            }
        )

        binding.rvHistory.apply {
            adapter = projectAdapter
            layoutManager = LinearLayoutManager(context)
        }
    }

    private fun observeProjects() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.allProjects.collect { projects ->
                if (projects.isEmpty()) {
                    binding.rvHistory.visibility = View.GONE
                    binding.layoutEmpty.visibility = View.VISIBLE
                } else {
                    binding.rvHistory.visibility = View.VISIBLE
                    binding.layoutEmpty.visibility = View.GONE
                    projectAdapter.submitList(projects)
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

