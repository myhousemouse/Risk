package com.Ebiz.risk.ui.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.Ebiz.risk.databinding.ItemProjectBinding
import com.Ebiz.risk.model.Project
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ProjectAdapter(
    private val onItemClick: (Project) -> Unit,
    private val onDeleteClick: (Project) -> Unit
) : ListAdapter<Project, ProjectAdapter.ProjectViewHolder>(ProjectDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProjectViewHolder {
        val binding = ItemProjectBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ProjectViewHolder(binding, onItemClick, onDeleteClick)
    }

    override fun onBindViewHolder(holder: ProjectViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class ProjectViewHolder(
        private val binding: ItemProjectBinding,
        private val onItemClick: (Project) -> Unit,
        private val onDeleteClick: (Project) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(project: Project) {
            binding.tvProjectTitle.text = project.title
            binding.tvProjectDescription.text = project.description

            // 날짜 포맷
            val dateFormat = SimpleDateFormat("yyyy.MM.dd", Locale.getDefault())
            binding.tvProjectDate.text = dateFormat.format(Date(project.date))

            // 통계
            binding.tvFailureProbability.text = String.format("%.1f%%", project.failureProbability)
            binding.tvTotalRpn.text = project.totalRPN.toString()
            binding.tvEstimatedLoss.text = project.estimatedLoss.toInt().toString()

            // 클릭 리스너
            binding.cardProject.setOnClickListener {
                onItemClick(project)
            }

            binding.btnDelete.setOnClickListener {
                onDeleteClick(project)
            }
        }
    }

    private class ProjectDiffCallback : DiffUtil.ItemCallback<Project>() {
        override fun areItemsTheSame(oldItem: Project, newItem: Project): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Project, newItem: Project): Boolean {
            return oldItem == newItem
        }
    }
}

