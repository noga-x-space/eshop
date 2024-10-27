import React from "react";

const ProductDetails = () => {
  const styles = {
    position: "relative",
    width: "100%",
    height: 0,
    paddingTop: "70.7071%",
    paddingBottom: 0,
    boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
    marginTop: "1.6em",
    marginBottom: "0.9em",
    overflow: "hidden",
    borderRadius: "8px",
    willChange: "transform",
  };

  const iframeStyles = {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    border: "none",
    padding: 0,
    margin: 0,
  };

  return (
    <div style={styles}>
      <iframe
        loading="lazy"
        style={iframeStyles}
        src="https://www.canva.com/design/DAGPyOKjROI/l0rmjbbly6Nej9RFX668WQ/view?embed"
        allowfullscreen="allowfullscreen"
        allow="fullscreen"
      />
      {/* ... other content ... */}
    </div>
  );
};

export default ProductDetails;


// // <div style="position: relative; width: 100%; height: 0; padding-top: 70.7071%;
// //  padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
// //  border-radius: 8px; will-change: transform;">
// //   <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
// //     src="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAGPyOKjROI&#x2F;l0rmjbbly6Nej9RFX668WQ&#x2F;view?embed" allowfullscreen="allowfullscreen" allow="fullscreen">
// //   </iframe>
// // </div>
// // <a href="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAGPyOKjROI&#x2F;l0rmjbbly6Nej9RFX668WQ&#x2F;view?utm_content=DAGPyOKjROI&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">White and Brown Minimalist Blank Note Document</a> על ידי polymer Horse