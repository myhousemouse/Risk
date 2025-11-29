package com.Ebiz.risk.ui.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.Ebiz.risk.databinding.ItemRiskBinding
import com.Ebiz.risk.model.Risk

class RiskAdapter : ListAdapter<Risk, RiskAdapter.RiskViewHolder>(RiskDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RiskViewHolder {
        val binding = ItemRiskBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return RiskViewHolder(binding)
    }

    override fun onBindViewHolder(holder: RiskViewHolder, position: Int) {
        holder.bind(getItem(position), position + 1)
    }

    class RiskViewHolder(
        private val binding: ItemRiskBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(risk: Risk, rank: Int) {
            binding.tvRiskRank.text = rank.toString()
            binding.tvRiskName.text = risk.name
            binding.tvRiskDescription.text = risk.description
            binding.tvRpn.text = risk.rpn.toString()
            binding.tvOccurrence.text = risk.occurrence.toString()
            binding.tvSeverity.text = risk.severity.toString()
            binding.tvDetection.text = risk.detection.toString()

            // 순위에 따른 배경색 설정
            val rankColor = when (rank) {
                1 -> android.graphics.Color.parseColor("#F44336")
                2 -> android.graphics.Color.parseColor("#FF9800")
                else -> android.graphics.Color.parseColor("#FFC107")
            }
            binding.tvRiskRank.setBackgroundColor(rankColor)
        }
    }

    private class RiskDiffCallback : DiffUtil.ItemCallback<Risk>() {
        override fun areItemsTheSame(oldItem: Risk, newItem: Risk): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Risk, newItem: Risk): Boolean {
            return oldItem == newItem
        }
    }
}

