import React from 'react'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'

const CommentLoader = (props: any) => (
  <ContentLoader
    speed={3}
    width={400}
    height={200}
    viewBox="0 0 400 200"
    backgroundColor="#ebebeb"
    foregroundColor="#f2f2f2"
    {...props}
  >
    <Rect x="63" y="7" rx="3" ry="3" width="113" height="11" /> 
    <Rect x="402" y="-119" rx="3" ry="3" width="410" height="6" /> 
    <Circle cx="23" cy="23" r="23" /> 
    <Rect x="64" y="35" rx="0" ry="0" width="255" height="20" /> 
    <Rect x="66" y="70" rx="0" ry="0" width="104" height="8" /> 
    <Rect x="190" y="70" rx="0" ry="0" width="53" height="8" /> 
    <Rect x="261" y="70" rx="0" ry="0" width="58" height="9" /> 
    <Circle cx="86" cy="115" r="23" /> 
    <Rect x="130" y="102" rx="0" ry="0" width="113" height="11" /> 
    <Rect x="132" y="127" rx="0" ry="0" width="255" height="40" /> 
    <Rect x="134" y="186" rx="0" ry="0" width="104" height="8" /> 
    <Rect x="257" y="187" rx="0" ry="0" width="53" height="8" /> 
    <Rect x="325" y="187" rx="0" ry="0" width="62" height="8" />
  </ContentLoader>
)

export { CommentLoader }
