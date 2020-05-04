import React, { useContext } from 'react';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { AuthService } from '../../services/authentication_service/authentication_service';
import { VersionService } from '../../services/version_service/version_service';
import { Apiv1VersionService } from '../../services/version_service/implementations/apiv1_version_service';
import { FakedVersionService } from '../../services/version_service/implementations/faked_version_service';
import { Apiv1EngagementService } from '../../services/engagement_service/implementations/apiv1_engagement_service';
import { Apiv1AuthService } from '../../services/authentication_service/implementations/apiv1_auth_service';
import { FakedAuthService } from '../../services/authentication_service/implementations/faked_auth_service';
import { Config } from '../../schemas/config';
import { FakedEngagementService } from '../../services/engagement_service/implementations/faked_engagement_service';
import { ConfigContext } from '../config_context/config_context';
import { Request } from '../../utilities/request';

interface ServiceProvider {
  engagementService: EngagementService;
  authenticationService: AuthService;
  versionService: VersionService;
}

const ProductionServiceProviders = (config: Config) => {
  const authService = new Apiv1AuthService(config);
  const { beforeRequest, onRequestSuccess, onRequestFailure } = new Request({
    authenticationRepository: authService,
  });
  return {
    engagementService: new Apiv1EngagementService(
      config.backendUrl,
      beforeRequest,
      onRequestSuccess,
      onRequestFailure
    ),
    authenticationService: authService,
    versionService: new Apiv1VersionService(
      config.backendUrl,
      beforeRequest,
      onRequestSuccess,
      onRequestFailure
    ),
  };
};

const FakedServiceProviders = (config: Config) => ({
  engagementService: new FakedEngagementService(),
  authenticationService: new FakedAuthService(),
  versionService: new FakedVersionService(),
});

export const ServiceProviderContext = React.createContext<ServiceProvider>({
  authenticationService: null,
  engagementService: null,
  versionService: null,
});

export const ServiceProvider = ({
  children,
  shouldUseFaked = process.env.REACT_APP_USE_FAKED.toLowerCase() === 'true',
}: {
  children: any;
  shouldUseFaked?: boolean;
}) => {
  const configContext = useContext(ConfigContext);
  return (
    <ServiceProviderContext.Provider
      value={
        shouldUseFaked
          ? FakedServiceProviders(configContext.appConfig)
          : ProductionServiceProviders(configContext.appConfig)
      }
    >
      {children}
    </ServiceProviderContext.Provider>
  );
};