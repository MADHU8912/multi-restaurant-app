pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Using local project files or GitHub repo'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker-compose down || exit 0'
                bat 'docker-compose build'
            }
        }

        stage('Run Containers') {
            steps {
                bat 'docker-compose up -d'
            }
        }

        stage('Check Containers') {
            steps {
                bat 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Build and deployment completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}