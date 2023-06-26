import React from 'react'
import { Route, Navigate } from 'react-router-dom';

export default function PublicRoute({ component: Component, isAuthenticated, ...rest}) {
    return (
        <Route
          {...rest}
          render={(props) =>
            isAuthenticated ? (
              <Navigate to ="/" />
            ) : (
              <Component {...props}/>
            )
          }
        />
      );
}

