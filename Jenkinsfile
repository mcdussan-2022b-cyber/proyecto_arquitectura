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
                    bat 'npm install'
                }
            }
        }

        stage('Instalar dependencias Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Probar Backend (10 segundos)') {
            steps {
                dir('backend') {
                    echo 'Iniciando backend por 10 segundos...'
                    bat 'start "" cmd /c "node src/server.js & timeout /t 10"'
                }
            }
        }

        stage('Probar Frontend (10 segundos)') {
            steps {
                dir('frontend') {
                    echo 'Iniciando frontend por 10 segundos...'
                    // npm run dev se queda colgado en Windows, así que lo abrimos en un cmd separado
                    bat 'start "" cmd /c "npm run dev & timeout /t 10"'
                }
            }
        }
    }
}
