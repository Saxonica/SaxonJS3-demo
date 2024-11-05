<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                xmlns:ex="http://example.com/ns/api"
                xmlns:f="https://www.saxonica.com/ns/functions"
                xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">

<xsl:output method="xml" encoding="utf-8" indent="yes"/>

<xsl:param name="port" select="3002"/>

<xsl:variable name="uri" select="'http://localhost:' || $port || '/pages'"/>

<xsl:template name="xsl:initial-template">
  <xsl:apply-templates select="ixsl:page()"/>
</xsl:template>

<xsl:template match="/*">
  <ixsl:promise select="ixsl:http-request(
                        map {'method': 'GET','href': $uri }
                        )"
                on-completion="f:more#1"
                on-failure="f:fail#1"/> 
</xsl:template>

<xsl:template match="/*" mode="update">
  <xsl:param name="items" as="element()*"/>
  <xsl:result-document href="?." method="ixsl:append-content">
    <xsl:sequence select="$items"/>
  </xsl:result-document>
</xsl:template>

<xsl:function name="f:more" ixsl:updating="yes">
  <xsl:param name="json" as="map(*)"/>
  <xsl:variable name="body" select="parse-json($json?body)"/>

  <xsl:result-document href="#list" method="ixsl:append-content">
    <li>Read a page of data:</li>
    <xsl:for-each select="array:flatten($body?data)">
      <li>{.}</li>
    </xsl:for-each>
  </xsl:result-document>

  <xsl:if test="$body?nextPage">
    <ixsl:promise select="ixsl:http-request(
                          map {'method': 'GET','href': $uri || '?page=' || $body?nextPage }
                          )"
                  on-completion="f:more#1"
                  on-failure="f:fail#1"/> 
  </xsl:if>
</xsl:function>

<xsl:function name="f:fail" ixsl:updating="yes">
  <xsl:param name="error"/>
  <xsl:message select="serialize($error, map {'method':'json', 'indent': true()})"/>
</xsl:function>

</xsl:stylesheet>
