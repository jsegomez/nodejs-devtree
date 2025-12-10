pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        GITHUB_SSH = credentials('github-ssh-jenkins')
        IMAGE_NAME = "jsegomez/demo-app"
    }

    stages {

        stage('Checkout App Code') {
            steps {
                sshagent(['github-ssh-jenkins']) {
                    sh 'git clone -b development git@github.com:jsegomez/nodejs-devtree.git .'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    VERSION_TAG = "build-${env.BUILD_NUMBER}"
                    sh "docker build -t ${IMAGE_NAME}:${VERSION_TAG} ."
                    sh "docker tag ${IMAGE_NAME}:${VERSION_TAG} ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin'
                script {
                    sh "docker push ${IMAGE_NAME}:${VERSION_TAG}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Checkout Manifests Repo') {
            steps {
                dir('manifests') {
                    sshagent(['github-ssh-jenkins']) {
                        sh 'git clone git@github.com:jsegomez/devops-nodejs-devtree.git .'
                    }
                }
            }
        }

        stage('Update Deployment Image Tag') {
            steps {
                dir('manifests/demo-app') {
                    script {
                        sh "sed -i \"s|image: jsegomezz/demo-app:.*|image: jsegomezz/demo-app:${VERSION_TAG}|g\" deployment.yaml"
                    }
                }
            }
        }

        stage('Commit & Push Manifests') {
            steps {
                dir('manifests') {
                    sshagent(['github-ssh-jenkins']) {
                        sh '''
                            git add .
                            git commit -m "Update image to ${IMAGE_NAME}:${VERSION_TAG}"
                            git push
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                dir('manifests/demo-app') {
                    sh 'kubectl apply -f namespace.yaml || true'
                    sh 'kubectl apply -f deployment.yaml'
                    sh 'kubectl apply -f service.yaml'
                    sh 'kubectl apply -f hpa.yaml'
                }
            }
        }

        stage('Rollout Status') {
            steps {
                sh 'kubectl rollout status deployment/demo-app -n demo-app'
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}
