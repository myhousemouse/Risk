package com.Ebiz.risk.repository

import com.Ebiz.risk.data.ProjectDao
import com.Ebiz.risk.data.RiskDao
import com.Ebiz.risk.model.Project
import com.Ebiz.risk.model.ProjectWithRisks
import com.Ebiz.risk.model.Risk
import kotlinx.coroutines.flow.Flow

class RiskRepository(
    private val projectDao: ProjectDao,
    private val riskDao: RiskDao
) {
    // Project operations
    fun getAllProjects(): Flow<List<Project>> = projectDao.getAllProjects()

    fun getAllProjectsWithRisks(): Flow<List<ProjectWithRisks>> =
        projectDao.getAllProjectsWithRisks()

    suspend fun getProjectWithRisks(projectId: Long): ProjectWithRisks? =
        projectDao.getProjectWithRisks(projectId)

    suspend fun insertProject(project: Project): Long =
        projectDao.insertProject(project)

    suspend fun updateProject(project: Project) =
        projectDao.updateProject(project)

    suspend fun deleteProject(project: Project) {
        riskDao.deleteRisksByProject(project.id)
        projectDao.deleteProject(project)
    }

    // Risk operations
    fun getRisksByProject(projectId: Long): Flow<List<Risk>> =
        riskDao.getRisksByProject(projectId)

    suspend fun insertRisk(risk: Risk): Long =
        riskDao.insertRisk(risk)

    suspend fun insertRisks(risks: List<Risk>): List<Long> =
        riskDao.insertRisks(risks)

    suspend fun updateRisk(risk: Risk) =
        riskDao.updateRisk(risk)

    suspend fun deleteRisk(risk: Risk) =
        riskDao.deleteRisk(risk)

    // Business logic
    fun calculateRPN(occurrence: Int, severity: Int, detection: Int): Int {
        return occurrence * severity * detection
    }

    fun calculateFailureProbability(totalRPN: Int, riskCount: Int): Double {
        // RPN 기반 실패 확률 계산 (최대 RPN = 1000 per risk)
        val maxPossibleRPN = riskCount * 1000.0
        val probability = (totalRPN / maxPossibleRPN) * 100.0
        return probability.coerceIn(0.0, 100.0)
    }

    fun calculateEstimatedLoss(budget: Double, failureProbability: Double): Double {
        return budget * (failureProbability / 100.0)
    }
}

