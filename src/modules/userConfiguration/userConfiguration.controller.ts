import { examEdgeTextKind } from '../exam/types';
import { User } from '../user/User.entity';
import { buildUserConfigurationService } from './userConfiguration.service';

export { buildUserConfigurationController };

function buildUserConfigurationController() {
    const userConfigurationService = buildUserConfigurationService();
    const userConfigurationController = {
        updateDefaultEdgeText,
        getAllUserConfigurations,
    };

    return userConfigurationController;

    async function updateDefaultEdgeText(
        params: { body: { kind: examEdgeTextKind; text: string } },
        user: User,
    ) {
        return userConfigurationService.updateDefaultEdgeText(
            user,
            params.body.kind,
            params.body.text,
        );
    }

    async function getAllUserConfigurations() {
        return userConfigurationService.getAllUserConfigurations();
    }
}
