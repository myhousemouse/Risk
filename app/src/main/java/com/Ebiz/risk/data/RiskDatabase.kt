package com.Ebiz.risk.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.Ebiz.risk.model.Project
import com.Ebiz.risk.model.Risk

@Database(
    entities = [Project::class, Risk::class],
    version = 1,
    exportSchema = false
)
abstract class RiskDatabase : RoomDatabase() {
    abstract fun projectDao(): ProjectDao
    abstract fun riskDao(): RiskDao

    companion object {
        @Volatile
        private var INSTANCE: RiskDatabase? = null

        fun getDatabase(context: Context): RiskDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    RiskDatabase::class.java,
                    "risk_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}

