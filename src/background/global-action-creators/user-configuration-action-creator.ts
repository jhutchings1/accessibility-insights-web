// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetNativeHighContrastModePayload,
} from '../actions/action-payloads';
import { UserConfigurationActions } from '../actions/user-configuration-actions';

export class UserConfigurationActionCreator {
    constructor(private readonly userConfigActions: UserConfigurationActions) {}

    public getUserConfigurationState = () => this.userConfigActions.getCurrentState.invoke(null);

    public setTelemetryState = (enableTelemetry: boolean) =>
        this.userConfigActions.setTelemetryState.invoke(enableTelemetry);

    public setHighContrastMode = (payload: SetHighContrastModePayload) =>
        this.userConfigActions.setHighContrastMode.invoke(payload);

    public setNativeHighContrastMode = (payload: SetNativeHighContrastModePayload) =>
        this.userConfigActions.setNativeHighContrastMode.invoke(payload);

    public setIssueFilingService = (payload: SetIssueFilingServicePayload) =>
        this.userConfigActions.setIssueFilingService.invoke(payload);

    public setIssueFilingServiceProperty = (payload: SetIssueFilingServicePropertyPayload) =>
        this.userConfigActions.setIssueFilingServiceProperty.invoke(payload);

    public saveIssueFilingSettings = (payload: SaveIssueFilingSettingsPayload) =>
        this.userConfigActions.saveIssueFilingSettings.invoke(payload);
}
