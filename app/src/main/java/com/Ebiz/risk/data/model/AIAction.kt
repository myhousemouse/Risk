package com.Ebiz.risk.data.model

data class AIAction(
    val title: String,
    val description: String,
    val impact: Impact,
    val effort: Effort
) {
    enum class Impact {
        HIGH, MEDIUM, LOW
    }

    enum class Effort {
        HIGH, MEDIUM, LOW
    }
}

data class RiskAction(
    val riskId: Int,
    val riskName: String,
    val actions: List<AIAction>
)

