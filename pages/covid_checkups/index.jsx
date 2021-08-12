import { withAuth } from 'lib/withAuth'
import Router from 'next/router'

const Checkups = () => null;

Checkups.getInitialProps = (ctx) => {
  if(process.browser){
    Router.replace("/", "/")
  } 
  else {
    ctx.res.writeHead(302, { Location: "/" })
    ctx.res.end();
  }
};

export default withAuth(Checkups)
