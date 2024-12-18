import java.io.PrintStream

plugins {
    // Apply the application plugin to add support for building a CLI application in Java.
    application
}

repositories {
    // Use Maven Central for resolving dependencies.
    mavenCentral()
}

val serverPort = project.findProperty("serverPort")?.toString() ?: "3002"

defaultTasks("setup")

tasks.register("setupNodeJs") {
  doLast {
    copy {
      into(layout.buildDirectory)
      from(layout.projectDirectory.dir("src/nodejs"))
      }
  }

  doLast {
    exec {
      workingDir(layout.buildDirectory.get().asFile)
      commandLine(listOf("npm", "install"))
    }
  }

  doLast {
    copy {
      into(layout.buildDirectory.dir("js"))
      from(layout.buildDirectory.dir("saxonjs3/browser")) {
        include("*.js")
      }
      from(layout.buildDirectory.dir("saxonjs3/saxonjs-he-package")) {
        include("*.js")
      }
    }
  }

  doLast {
    val stream = PrintStream(layout.buildDirectory.file(".env").get().asFile)
    stream.println("PORT=${serverPort}")
    stream.close()
  }
}

tasks.register("setup") {
  dependsOn("copyStaticFiles")
  dependsOn("setupNodeJs")
  dependsOn("compileXslt")
  // Just some place to hang dependencies
}

tasks.register<Exec>("server") {
  dependsOn("setup")
  workingDir(layout.buildDirectory.get().asFile)
  commandLine(listOf("node", "server.js"))
}

tasks.register<Copy>("copyStaticFiles") {
  into(layout.buildDirectory)
  from(layout.projectDirectory.dir("src")) {
    include("**/*.html")
    include("**/*.css")
    include("**/*.js")
  }
}

val compileXslt = tasks.register("compileXslt") {
  dependsOn("setupNodeJs")
  // Just somewhere to hang dependencies
}

val xslFiles = fileTree(layout.projectDirectory.dir("src")) {
  include("**/*.xsl")
}

xslFiles.forEach {
  val srcpos = it.toString().lastIndexOf("/src/")
  val path = it.toString().substring(srcpos+5)
  val compile = tasks.register<Exec>("compile_${path.replace("/","_")}") {
    dependsOn("setupNodeJs")
    inputs.file(layout.projectDirectory.file("src/${path}"))
    outputs.file(layout.buildDirectory.file(path.replace(".xsl", ".sef.json")))
    workingDir(layout.buildDirectory.get().asFile)
    commandLine("node", "node_modules/xslt3/xslt3.js",
                "-xsl:../src/${path}", "-export:${path.replace(".xsl", ".sef.json")}",
                "-stublib:stublib.json",
                "-nogo", "-ns:##html5")
  }
  compileXslt { dependsOn(compile) }
}
 
tasks.register("helloWorld") {
  doLast {
    println("Hello, world.")
  }
}
