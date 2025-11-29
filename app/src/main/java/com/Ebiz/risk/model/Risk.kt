package com.Ebiz.risk.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "risks")
data class Risk(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val projectId: Long,
    val name: String,
    val description: String,
    val occurrence: Int,       // 발생도 (1-10)
    val severity: Int,         // 심각도 (1-10)
    val detection: Int,        // 검출도 (1-10)
    val rpn: Int               // RPN = O × S × D
) {
    companion object {
        fun calculateRPN(occurrence: Int, severity: Int, detection: Int): Int {
            return occurrence * severity * detection
        }
    }
}

