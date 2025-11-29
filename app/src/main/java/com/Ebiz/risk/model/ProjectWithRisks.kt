package com.Ebiz.risk.model

import androidx.room.Embedded
import androidx.room.Relation

data class ProjectWithRisks(
    @Embedded val project: Project,
    @Relation(
        parentColumn = "id",
        entityColumn = "projectId"
    )
    val risks: List<Risk>
)

