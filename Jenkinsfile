pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'   // configure in Jenkins → Global Tool Configuration
    }

    environment {
        CI = 'true'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Lint (Optional)') {
            steps {
                bat 'npm run lint || exit 0'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test -- --watchAll=false'
            }
        }

        stage('Build React App') {
            steps {
                bat 'npm run build'
            }
        }

        // ✅ SonarQube (for JS/React)
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        bat """
                        npx sonar-scanner ^
                        -Dsonar.projectKey=react-app ^
                        -Dsonar.projectName=react-app ^
                        -Dsonar.sources=src ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.login=%SONAR_TOKEN%
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t react-app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                bat 'docker stop react-app || exit 0'
                bat 'docker rm react-app || exit 0'
                bat 'docker run -d -p 3000:80 --name react-app react-app'
            }
        }
    }

    post {
        success {
            echo '✅ React Build & Deployment Successful!'
        }
        failure {
            echo '❌ Build Failed!'
        }
        always {
            echo 'Pipeline Finished.'
        }
    }
}