package com.Ebiz.risk.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.Ebiz.risk.R
import com.Ebiz.risk.data.model.AIAction
import com.Ebiz.risk.data.model.RiskAction
import com.Ebiz.risk.databinding.ItemActionBinding
import com.Ebiz.risk.databinding.ItemRiskHeaderBinding

class AIActionsAdapter : ListAdapter<RiskAction, RecyclerView.ViewHolder>(DiffCallback()) {

    override fun getItemViewType(position: Int): Int {
        return R.layout.item_risk_header
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return RiskViewHolder(
            ItemRiskHeaderBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        (holder as RiskViewHolder).bind(getItem(position))
    }

    class RiskViewHolder(
        private val binding: ItemRiskHeaderBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(riskAction: RiskAction) {
            binding.tvRiskName.text = riskAction.riskName
            binding.tvRiskNumber.text = riskAction.riskId.toString()

            // 리스크 번호에 따른 색상 설정
            val colorRes = when (riskAction.riskId) {
                1 -> R.color.red_500
                2 -> R.color.orange_500
                else -> R.color.yellow_500
            }
            binding.tvRiskNumber.setBackgroundResource(colorRes)

            // Actions 표시
            binding.rvSubActions.apply {
                layoutManager = androidx.recyclerview.widget.LinearLayoutManager(context)
                adapter = ActionItemAdapter().apply {
                    submitList(riskAction.actions)
                }
            }
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<RiskAction>() {
        override fun areItemsTheSame(oldItem: RiskAction, newItem: RiskAction): Boolean {
            return oldItem.riskId == newItem.riskId
        }

        override fun areContentsTheSame(oldItem: RiskAction, newItem: RiskAction): Boolean {
            return oldItem == newItem
        }
    }
}

class ActionItemAdapter : ListAdapter<AIAction, ActionItemAdapter.ViewHolder>(ActionDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            ItemActionBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class ViewHolder(
        private val binding: ItemActionBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(action: AIAction) {
            binding.tvActionTitle.text = action.title
            binding.tvActionDescription.text = action.description

            // Impact 배지
            binding.tvImpact.text = when (action.impact) {
                AIAction.Impact.HIGH -> "효과 높음"
                AIAction.Impact.MEDIUM -> "효과 보통"
                AIAction.Impact.LOW -> "효과 낮음"
            }

            val impactColorRes = when (action.impact) {
                AIAction.Impact.HIGH -> R.drawable.bg_badge_red
                AIAction.Impact.MEDIUM -> R.drawable.bg_badge_yellow
                AIAction.Impact.LOW -> R.drawable.bg_badge_green
            }
            binding.tvImpact.setBackgroundResource(impactColorRes)

            // Effort 배지
            binding.tvEffort.text = when (action.effort) {
                AIAction.Effort.HIGH -> "노력 많음"
                AIAction.Effort.MEDIUM -> "노력 보통"
                AIAction.Effort.LOW -> "노력 적음"
            }

            val effortColorRes = when (action.effort) {
                AIAction.Effort.HIGH -> R.drawable.bg_badge_purple
                AIAction.Effort.MEDIUM -> R.drawable.bg_badge_blue
                AIAction.Effort.LOW -> R.drawable.bg_badge_teal
            }
            binding.tvEffort.setBackgroundResource(effortColorRes)
        }
    }

    class ActionDiffCallback : DiffUtil.ItemCallback<AIAction>() {
        override fun areItemsTheSame(oldItem: AIAction, newItem: AIAction): Boolean {
            return oldItem.title == newItem.title
        }

        override fun areContentsTheSame(oldItem: AIAction, newItem: AIAction): Boolean {
            return oldItem == newItem
        }
    }
}

