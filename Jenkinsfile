pipeline {
    agent any

    tools {
        jdk 'JDK-21'
        maven 'Maven-3.9.12'
    }

    environment {
        MAVEN_OPTS = '-Xmx1024m'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build All Microservices') {
            steps {
                bat 'mvn clean install -DskipTests -U'
            }
        }

        stage('Run Unit Tests') {
            steps {
                bat 'mvn test'
            }
        }

        // ✅ NEW: Wait until SonarQube is fully ready
        stage('Wait for SonarQube') {
            steps {
                script {
                    timeout(time: 2, unit: 'MINUTES') {
                        waitUntil {
                            def status = bat(
                                script: 'curl -s http://localhost:9000/api/system/status',
                                returnStdout: true
                            ).trim()

                            echo "SonarQube Status: ${status}"

                            return status.contains('UP')
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        bat """
                        mvn clean verify sonar:sonar ^
                        -Dsonar.projectKey=backend ^
                        -Dsonar.projectName=backend ^
                        -Dsonar.token=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }


        stage('Quality Gate') {
            steps {
                timeout(time: 15, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Verify Artifacts') {
            steps {
                bat 'dir /s /b target'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Docker Refresh') {
            steps {
                bat 'docker compose down -v'
                bat 'docker compose pull'
                bat 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ Build completed successfully!'
        }
        failure {
            echo '❌ Build failed.'
        }
        always {
            echo 'Pipeline finished.'
        }
    }
}