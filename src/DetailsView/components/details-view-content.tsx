// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { DetailsViewOverlay } from 'DetailsView/components/details-view-overlay/details-view-overlay';
import { InteractiveHeader } from 'DetailsView/components/interactive-header';
import { DetailsViewBody } from 'DetailsView/details-view-body';
import { DetailsViewContainerProps } from 'DetailsView/details-view-container';
import * as React from 'react';

export type DetailsViewContentProps = DetailsViewContainerProps & {
    isSideNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DetailsViewContent = NamedFC<DetailsViewContentProps>('DetailsViewContent', props => {
    const renderHeader = () => {
        const storeState = props.storeState;
        const visualizationStoreData = storeState.visualizationStoreData;
        return (
            <InteractiveHeader
                deps={props.deps}
                selectedPivot={visualizationStoreData.selectedDetailsViewPivot}
                featureFlagStoreData={storeState.featureFlagStoreData}
                tabClosed={props.storeState.tabStoreData.isClosed}
            />
        );
    };

    const renderOverlay = () => {
        const { deps, storeState } = props;
        return (
            <DetailsViewOverlay
                deps={deps}
                previewFeatureFlagsHandler={props.deps.previewFeatureFlagsHandler}
                scopingActionMessageCreator={props.deps.scopingActionMessageCreator}
                inspectActionMessageCreator={props.deps.inspectActionMessageCreator}
                detailsViewStoreData={storeState.detailsViewStoreData}
                scopingStoreData={storeState.scopingPanelStateStoreData}
                featureFlagStoreData={storeState.featureFlagStoreData}
                userConfigurationStoreData={storeState.userConfigurationStoreData}
            />
        );
    };

    const renderDetailsView = () => {
        const { deps, storeState } = props;
        const selectedDetailsRightPanelConfiguration = props.deps.getDetailsRightPanelConfiguration(
            {
                selectedDetailsViewPivot:
                    storeState.visualizationStoreData.selectedDetailsViewPivot,
                detailsViewRightContentPanel:
                    storeState.detailsViewStoreData.detailsViewRightContentPanel,
            },
        );
        const selectedDetailsViewSwitcherNavConfiguration = props.deps.getDetailsSwitcherNavConfiguration(
            {
                selectedDetailsViewPivot:
                    storeState.visualizationStoreData.selectedDetailsViewPivot,
            },
        );
        const selectedTest = selectedDetailsViewSwitcherNavConfiguration.getSelectedDetailsView(
            storeState,
        );

        const cardsViewData = props.deps.getCardViewData(
            props.storeState.unifiedScanResultStoreData.rules,
            props.storeState.unifiedScanResultStoreData.results,
            props.deps.getCardSelectionViewData(
                props.storeState.cardSelectionStoreData,
                props.storeState.unifiedScanResultStoreData,
                props.deps.isResultHighlightUnavailable,
            ),
        );

        const targetAppInfo = {
            name: props.storeState.tabStoreData.title,
            url: props.storeState.tabStoreData.url,
        };

        const scanMetadata: ScanMetadata = {
            timestamp: props.storeState.unifiedScanResultStoreData.timestamp,
            targetAppInfo: targetAppInfo,
            toolData: props.storeState.unifiedScanResultStoreData.toolInfo,
        };

        return (
            <DetailsViewBody
                deps={deps}
                tabStoreData={storeState.tabStoreData}
                assessmentStoreData={storeState.assessmentStoreData}
                pathSnippetStoreData={storeState.pathSnippetStoreData}
                featureFlagStoreData={storeState.featureFlagStoreData}
                selectedTest={selectedTest}
                detailsViewStoreData={storeState.detailsViewStoreData}
                visualizationStoreData={storeState.visualizationStoreData}
                visualizationScanResultData={storeState.visualizationScanResultStoreData}
                visualizationConfigurationFactory={props.deps.visualizationConfigurationFactory}
                assessmentsProvider={props.deps.assessmentsProvider}
                dropdownClickHandler={props.deps.dropdownClickHandler}
                clickHandlerFactory={props.deps.clickHandlerFactory}
                assessmentInstanceTableHandler={props.deps.assessmentInstanceTableHandler}
                issuesSelection={props.deps.issuesSelection}
                issuesTableHandler={props.deps.issuesTableHandler}
                rightPanelConfiguration={selectedDetailsRightPanelConfiguration}
                switcherNavConfiguration={selectedDetailsViewSwitcherNavConfiguration}
                userConfigurationStoreData={storeState.userConfigurationStoreData}
                cardsViewData={cardsViewData}
                cardSelectionStoreData={storeState.cardSelectionStoreData}
                scanIncompleteWarnings={
                    storeState.unifiedScanResultStoreData.scanIncompleteWarnings
                }
                scanMetadata={scanMetadata}
            />
        );
    };

    return (
        <>
            {renderHeader()}
            {renderDetailsView()}
            {renderOverlay()}
        </>
    );
});
