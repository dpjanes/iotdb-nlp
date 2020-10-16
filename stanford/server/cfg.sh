#
#   stanford/server/cfg.sh
#
#   David Janes
#   IOTDB
#   2020-10-16
#
#   CFG_CP is the classpath to use

CFG_ROOT=$(readlink -f $(dirname $0)/../..)
CFG_CP=.

PKG_NAME="stanford-ner"
PKG_VERSION="4.0.0"
CFG_CP="${CFG_CP}:${CFG_ROOT}/contrib/${PKG_NAME}-${PKG_VERSION}/stanford-ner.jar"

PKG_NAME="stanford-tagger"
PKG_VERSION="4.1.0"
CFG_CP="${CFG_CP}:${CFG_ROOT}/contrib/${PKG_NAME}-${PKG_VERSION}/stanford-postagger.jar"

PKG_NAME="json-simple"
PKG_VERSION="1.1.1"
CFG_CP="${CFG_CP}:${CFG_ROOT}/contrib/${PKG_NAME}-${PKG_VERSION}.jar"
