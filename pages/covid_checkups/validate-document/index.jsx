import { withAuth } from 'lib/withAuth'
import Router from 'next/router'

const ValidateDocument = () => null;

ValidateDocument.getInitialProps = (ctx) => {
  if(process.browser){
    Router.replace("/", "/")
  } 
  else {
    ctx.res.writeHead(302, { Location: "/" })
    ctx.res.end();
  }
};

export default withAuth(ValidateDocument)
