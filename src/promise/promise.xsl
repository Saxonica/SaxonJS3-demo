<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 	        xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                xmlns:ex="https://saxonica.com/ns/example/functions"
                xmlns:f="https://www.saxonica.com/ns/functions"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="#all"
                version="3.0">

<xsl:output method="html" html-version="5" encoding="utf-8" indent="no"/>

<xsl:key name="spans" match="span" use="@id"/>

<xsl:template name="xsl:initial-template">
  <xsl:apply-templates select="ixsl:page()//span[@id='hello']"/>
</xsl:template>

<xsl:template match="span">
  <ixsl:promise select="ex:returns-promise()"
                on-completion="f:success#1"
                on-failure="f:fail#1"/> 
</xsl:template>

<xsl:function name="f:success" ixsl:updating="yes">
  <xsl:param name="hello" as="xs:string"/>

  <xsl:result-document href="#hello" method="ixsl:replace-content">
    <xsl:sequence select="$hello"/>
  </xsl:result-document>
</xsl:function>

<xsl:function name="f:fail" ixsl:updating="yes">
  <xsl:param name="error"/>
  <xsl:message select="serialize($error, map {'method':'json', 'indent': true()})"/>
</xsl:function>

</xsl:stylesheet>
