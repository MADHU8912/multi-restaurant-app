pipeline {
    agent any

    stages {
        stage('Check Files') {
            steps {
                bat 'dir'
                bat 'dir frontend'
                bat 'dir backend'
                bat 'dir admin'
            }
        }

        stage('Docker Compose Down') {
            steps {
                bat 'docker compose down || exit /b 0'
            }
        }

        stage('Docker Compose Build') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Docker Compose Up') {
            steps {
                bat 'docker compose up -d'
            }
        }

        stage('Check Running Containers') {
            steps {
                bat 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Multi-restaurant app deployed successfully'
        }
        failure {
            echo 'Build failed'
        }
    }
}