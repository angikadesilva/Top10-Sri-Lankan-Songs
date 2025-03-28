pipeline {
    agent any  // Runs on any available Jenkins agent

    // Tools to install automatically (configure in Jenkins)
    tools {
        nodejs 'Node16'  // Must match Node.js version in Jenkins
    }

    // Environment variables (for DB credentials, etc.)
    environment {
        DB_HOST = 'localhost'
        DB_USER = credentials('DB_USER')  // Stored in Jenkins
        DB_PASS = credentials('DB_PASS')
    }

    stages {
        // Stage 1: Install dependencies
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        // Stage 2: Run tests (if applicable)
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        // Stage 3: Deploy (update later for AWS)
        stage('Deploy') {
            steps {
                echo 'Deployment skipped (running locally)'
                // Later: Add SSH/SCP commands for EC2
            }
        }
    }
}