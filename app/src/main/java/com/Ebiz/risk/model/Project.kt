package com.Ebiz.risk.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "projects")
data class Project(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String,
    val budget: Double,        // 예산 (만원)
    val date: Long,            // 생성 날짜 (timestamp)
    val totalRPN: Int,         // 총 RPN
    val failureProbability: Double,  // 실패 확률 (%)
    val estimatedLoss: Double  // 예상 손실 (만원)
)

