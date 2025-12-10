pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'jsegomez'
        IMAGE_NAME = 'nodejs-devtree'
        VERSION_TAG = "development-${BUILD_NUMBER}"
        LATEST_TAG = "latest"
    }

    stages {

        stage('Checkout App Repo') {
            steps {
                git branch: 'development',
                    credentialsId: 'github-ssh-jenkins',
                    url: 'git@github.com:jsegomez/nodejs-devtree.git'
            }
        }

        stage('Install & Test') {
            steps {
                sh '''
                npm install
                npm test || true
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t $DOCKERHUB_USER/$IMAGE_NAME:$LATEST_TAG .
                docker build -t $DOCKERHUB_USER/$IMAGE_NAME:$VERSION_TAG .
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    passwordVariable: 'DOCKER_PASS',
                    usernameVariable: 'DOCKER_USER'
                )]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push $DOCKER_USER/$IMAGE_NAME:$LATEST_TAG
                    docker push $DOCKER_USER/$IMAGE_NAME:$VERSION_TAG
                    docker logout
                    '''
                }
            }
        }

        stage('Update Manifests Repo') {
            steps {
                dir('manifests') {
                    sh '''
                    if [ ! -d devops-nodejs-devtree ]; then
                        git clone git@github.com:jsegomez/devops-nodejs-devtree.git
                    fi
                    cd devops-nodejs-devtree

                    sed -i "s|jsegomez/nodejs-devtree:.*|jsegomez/nodejs-devtree:${VERSION_TAG}|g" demo-app/deployment.yaml

                    git config user.email "jenkins@ci.local"
                    git config user.name "Jenkins CI"

                    git add .
                    git commit -m "Update image tag to ${VERSION_TAG}"
                    git push
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f manifests/devops-nodejs-devtree/demo-app/namespace.yaml
                kubectl apply -f manifests/devops-nodejs-devtree/demo-app/deployment.yaml
                kubectl apply -f manifests/devops-nodejs-devtree/demo-app/service.yaml
                kubectl apply -f manifests/devops-nodejs-devtree/demo-app/hpa.yaml

                kubectl rollout status deployment demo-app -n demo-app
                '''
            }
        }
    }
}
