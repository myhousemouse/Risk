package com.Ebiz.risk.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.Ebiz.risk.model.Risk
import kotlinx.coroutines.flow.Flow

@Dao
interface RiskDao {
    @Query("SELECT * FROM risks WHERE projectId = :projectId ORDER BY rpn DESC")
    fun getRisksByProject(projectId: Long): Flow<List<Risk>>

    @Query("SELECT * FROM risks WHERE id = :riskId")
    suspend fun getRiskById(riskId: Long): Risk?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRisk(risk: Risk): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRisks(risks: List<Risk>): List<Long>

    @Update
    suspend fun updateRisk(risk: Risk)

    @Delete
    suspend fun deleteRisk(risk: Risk)

    @Query("DELETE FROM risks WHERE projectId = :projectId")
    suspend fun deleteRisksByProject(projectId: Long)
}

