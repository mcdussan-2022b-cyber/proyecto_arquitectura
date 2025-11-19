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
                echo 'Instalando dependencias del backend...'
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Instalar dependencias Frontend') {
            steps {
                echo 'Instalando dependencias del frontend...'
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Iniciar Backend') {
            steps {
                echo 'Iniciando back-end en Node.js...'
                dir('backend') {
                    // IMPORTANTE: doble backslash por Windows
                    bat 'node .\\src\\server.js'
                }
            }
        }

        stage('Iniciar Frontend') {
            steps {
                echo 'Iniciando front-end en modo desarrollo...'
                dir('frontend') {
                    bat 'npm run dev'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado correctamente ✔'
        }
        failure {
            echo 'El pipeline ha fallado ✖'
        }
    }
}
