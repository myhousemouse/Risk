package com.Ebiz.risk.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.Ebiz.risk.data.RiskDatabase
import com.Ebiz.risk.data.model.RiskAction
import com.Ebiz.risk.model.Project
import com.Ebiz.risk.model.ProjectWithRisks
import com.Ebiz.risk.model.Risk
import com.Ebiz.risk.repository.AIRepository
import com.Ebiz.risk.repository.RiskRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch

class RiskViewModel(application: Application) : AndroidViewModel(application) {
    private val repository: RiskRepository
    private val aiRepository = AIRepository()

    // 현재 진행 중인 프로젝트 데이터
    private val _currentProject = MutableLiveData<Project?>()
    val currentProject: LiveData<Project?> = _currentProject

    private val _currentRisks = MutableLiveData<MutableList<Risk>>(mutableListOf())
    val currentRisks: LiveData<MutableList<Risk>> = _currentRisks

    private val _currentRiskIndex = MutableLiveData(0)
    val currentRiskIndex: LiveData<Int> = _currentRiskIndex

    // AI Actions 관련
    private val _aiActions = MutableLiveData<List<RiskAction>>(emptyList())
    val aiActions: LiveData<List<RiskAction>> = _aiActions

    private val _isLoadingAI = MutableLiveData(false)
    val isLoadingAI: LiveData<Boolean> = _isLoadingAI

    private val _aiError = MutableLiveData<String?>()
    val aiError: LiveData<String?> = _aiError

    // 저장된 프로젝트 목록
    val allProjects: Flow<List<Project>>
    val allProjectsWithRisks: Flow<List<ProjectWithRisks>>

    init {
        val database = RiskDatabase.getDatabase(application)
        repository = RiskRepository(database.projectDao(), database.riskDao())
        allProjects = repository.getAllProjects()
        allProjectsWithRisks = repository.getAllProjectsWithRisks()
    }

    // 프로젝트 생성 및 AI 제안 리스크 생성
    fun createNewProject(title: String, description: String, budget: Double) {
        val suggestedRisks = generateAISuggestedRisks()

        _currentProject.value = Project(
            title = title,
            description = description,
            budget = budget,
            date = System.currentTimeMillis(),
            totalRPN = 0,
            failureProbability = 0.0,
            estimatedLoss = 0.0
        )

        _currentRisks.value = suggestedRisks.toMutableList()
        _currentRiskIndex.value = 0
    }

    // AI가 제안하는 3가지 리스크 (실제로는 AI API 호출)
    private fun generateAISuggestedRisks(): List<Risk> {
        return listOf(
            Risk(
                projectId = 0,
                name = "시장 수요 부족",
                description = "목표 고객층의 실제 수요가 예상보다 현저히 낮을 수 있음",
                occurrence = 5,
                severity = 5,
                detection = 5,
                rpn = 125
            ),
            Risk(
                projectId = 0,
                name = "자금 고갈",
                description = "예상치 못한 비용 증가로 인한 운영 자금 부족",
                occurrence = 5,
                severity = 5,
                detection = 5,
                rpn = 125
            ),
            Risk(
                projectId = 0,
                name = "핵심 인력 이탈",
                description = "프로젝트 핵심 멤버의 중도 이탈로 인한 진행 차질",
                occurrence = 5,
                severity = 5,
                detection = 5,
                rpn = 125
            )
        )
    }

    // 리스크 점수 업데이트
    fun updateRiskScores(occurrence: Int, severity: Int, detection: Int) {
        val index = _currentRiskIndex.value ?: return
        val risks = _currentRisks.value ?: return

        if (index < risks.size) {
            val rpn = repository.calculateRPN(occurrence, severity, detection)
            risks[index] = risks[index].copy(
                occurrence = occurrence,
                severity = severity,
                detection = detection,
                rpn = rpn
            )
            _currentRisks.value = risks
        }
    }

    // 다음 리스크로 이동
    fun moveToNextRisk() {
        val current = _currentRiskIndex.value ?: 0
        _currentRiskIndex.value = current + 1
    }

    // 이전 리스크로 이동
    fun moveToPreviousRisk() {
        val current = _currentRiskIndex.value ?: 0
        if (current > 0) {
            _currentRiskIndex.value = current - 1
        }
    }

    // 현재 리스크 가져오기
    fun getCurrentRisk(): Risk? {
        val index = _currentRiskIndex.value ?: return null
        val risks = _currentRisks.value ?: return null
        return if (index < risks.size) risks[index] else null
    }

    // 전체 리스크 분석 완료
    fun completeRiskAnalysis(): Project? {
        val project = _currentProject.value ?: return null
        val risks = _currentRisks.value ?: return null

        val totalRPN = risks.sumOf { it.rpn }
        val failureProbability = repository.calculateFailureProbability(totalRPN, risks.size)
        val estimatedLoss = repository.calculateEstimatedLoss(project.budget, failureProbability)

        val finalProject = project.copy(
            totalRPN = totalRPN,
            failureProbability = failureProbability,
            estimatedLoss = estimatedLoss
        )

        _currentProject.value = finalProject
        return finalProject
    }

    // 프로젝트 저장
    fun saveProject(onComplete: (Long) -> Unit) {
        viewModelScope.launch {
            try {
                val project = _currentProject.value ?: return@launch
                val projectId = repository.insertProject(project)

                // 리스크들을 프로젝트 ID와 함께 저장
                val risks = _currentRisks.value?.map { it.copy(projectId = projectId) } ?: return@launch
                repository.insertRisks(risks)

                onComplete(projectId)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // 프로젝트 삭제
    fun deleteProject(project: Project, onComplete: () -> Unit) {
        viewModelScope.launch {
            try {
                repository.deleteProject(project)
                onComplete()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // 프로젝트 로드
    fun loadProject(projectId: Long, onComplete: (ProjectWithRisks?) -> Unit) {
        viewModelScope.launch {
            try {
                val projectWithRisks = repository.getProjectWithRisks(projectId)
                onComplete(projectWithRisks)
            } catch (e: Exception) {
                e.printStackTrace()
                onComplete(null)
            }
        }
    }

    // 현재 상태 초기화
    fun resetCurrentProject() {
        _currentProject.value = null
        _currentRisks.value = mutableListOf()
        _currentRiskIndex.value = 0
        _aiActions.value = emptyList<RiskAction>()
        _aiError.value = null
    }

    // AI로 실행 조언 생성
    fun generateAIActions() {
        val project = _currentProject.value ?: return
        val risks = _currentRisks.value ?: return

        if (risks.isEmpty()) return

        _isLoadingAI.value = true
        _aiError.value = null

        viewModelScope.launch {
            try {
                val riskPairs = risks.mapIndexed { index, risk ->
                    (index + 1) to risk.name
                }

                val result = aiRepository.generateRiskActions(
                    projectTitle = project.title,
                    projectDescription = project.description,
                    risks = riskPairs
                )

                result.onSuccess { actions ->
                    _aiActions.value = actions
                }.onFailure { error ->
                    _aiError.value = error.message ?: "AI 조언 생성에 실패했습니다"
                    // 실패 시 기본 조언 제공
                    _aiActions.value = emptyList<RiskAction>()
                }
            } catch (e: Exception) {
                _aiError.value = e.message ?: "알 수 없는 오류가 발생했습니다"
                _aiActions.value = emptyList<RiskAction>()
            } finally {
                _isLoadingAI.value = false
            }
        }
    }
}

