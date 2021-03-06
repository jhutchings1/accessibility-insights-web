// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LinkComponentType } from 'common/types/link-component-type';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import * as React from 'react';

export type AndroidSetupStep = React.ComponentType<CommonAndroidSetupStepProps>;

export type CommonAndroidSetupStepProps = {
    userConfigurationStoreData: UserConfigurationStoreData;
    androidSetupStoreData: AndroidSetupStoreData;
    deps: AndroidSetupPageDeps;
};

export type AndroidSetupPageDeps = {
    androidSetupActionCreator: AndroidSetupActionCreator;
    androidSetupStepComponentProvider: AndroidSetupStepComponentProvider;
    LinkComponent: LinkComponentType;
};

// 'Partial' is used to allow missing step IDs as they get implemented.
// Once all step IDs have components, we should remove 'Partial'
export type AndroidSetupStepComponentProvider = Partial<
    Record<AndroidSetupStepId, AndroidSetupStep>
>;
