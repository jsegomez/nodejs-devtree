pipeline {
    agent any

    environment {
        REGISTRY = "jsegomezz"
        IMAGE = "nodejs-devtree"
        COMMIT = "${env.GIT_COMMIT[0..6]}"  // etiqueta con primeros 7 caracteres
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build TypeScript') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker image') {
            steps {
                sh """
                docker build -t $REGISTRY/$IMAGE:latest \
                             -t $REGISTRY/$IMAGE:$COMMIT .
                """
            }
        }

        stage('Push Docker images') {
            steps {
                sh """
                docker push $REGISTRY/$IMAGE:latest
                docker push $REGISTRY/$IMAGE:$COMMIT
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f /var/jenkins_home/manifests/"
            }
        }
    }
}
