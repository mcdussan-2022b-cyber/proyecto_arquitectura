pipeline {
    agent any

    stages {
        stage('Checkout del repositorio') {
            steps {
                echo 'Clonando el repositorio desde GitHub...'
                checkout scm
            }
        }

        stage('Instalar dependencias Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Instalar dependencias Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Probar Backend (10 segundos)') {
            steps {
                dir('backend') {
                    echo 'Iniciando backend por 10 segundos para demostración...'
                    sh 'node src/server.js & sleep 10'
                }
            }
        }

        stage('Probar Frontend (10 segundos)') {
            steps {
                dir('frontend') {
                    echo 'Iniciando frontend por 10 segundos para demostración...'
                    sh 'npm run dev & sleep 10'
                }
            }
        }
    }
}
