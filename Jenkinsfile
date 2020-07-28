#!groovy
timeout(10) {
  node {
    def flow = load "/scripts/util.groovy"

    flow.init()

    flow.wstage("Build/Test", {
      sh 'sh create-npmrc.sh --ci'
      sh 'docker-compose run --rm test'
    }, {
      sh 'docker-compose down -v'
    })

    flow.wstage("Analyse", {
      flow.sonarAnalysis()
    })

    flow.end()
  }
}
