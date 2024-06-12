'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface Props {
  spec: Record<string, any>;
}

function ReactSwagger({ spec }: Props): React.ReactElement {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;
