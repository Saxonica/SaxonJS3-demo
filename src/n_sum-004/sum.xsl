<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 	        xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:ex="https://saxonica.com/ns/example/functions"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">

<xsl:output method="xml" encoding="utf-8" indent="no" omit-xml-declaration="yes"/>

<xsl:param name="a" select="3"/>
<xsl:param name="b" select="4"/>

<xsl:variable name="numbers" select="(xs:integer($a), xs:integer($b))"/>

<xsl:template name="xsl:initial-template">
  <doc>
    <xsl:text>Using an extension function sum([{$a}, {$b}]) = </xsl:text>
    <xsl:apply-templates select="ex:sum-array(array { $numbers })"/>
  </doc>
</xsl:template>

</xsl:stylesheet>
