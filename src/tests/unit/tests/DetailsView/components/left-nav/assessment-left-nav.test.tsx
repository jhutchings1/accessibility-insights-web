// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlags } from 'common/feature-flags';
import { VisualizationType } from 'common/types/visualization-type';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';
import {
    ManualTestStatus,
    ManualTestStatusData,
} from '../../../../../../common/types/manual-test-status';
import {
    AssessmentLeftNav,
    AssessmentLeftNavDeps,
    AssessmentLeftNavLink,
    AssessmentLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/assessment-left-nav';
import { LeftNavLinkBuilder } from '../../../../../../DetailsView/components/left-nav/left-nav-link-builder';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';
import { DictionaryStringTo } from '../../../../../../types/common-types';

describe('AssessmentLeftNav', () => {
    let linkStub: AssessmentLeftNavLink;
    let deps: AssessmentLeftNavDeps;
    let props: AssessmentLeftNavProps;
    let leftNavLinkBuilderMock: IMock<LeftNavLinkBuilder>;
    let navLinkHandlerMock: NavLinkHandler;
    let assessmentsProviderStub: AssessmentsProvider;
    let assessmentsDataStub: DictionaryStringTo<ManualTestStatusData>;
    const expandedTest: VisualizationType = 1;

    beforeEach(() => {
        assessmentsDataStub = {};
        assessmentsProviderStub = {} as AssessmentsProvider;
        leftNavLinkBuilderMock = Mock.ofType(LeftNavLinkBuilder, MockBehavior.Strict);
        navLinkHandlerMock = {
            onOverviewClick: () => {},
            onAssessmentTestClick: (x, y) => {},
        } as NavLinkHandler;
        linkStub = {
            status: ManualTestStatus.UNKNOWN,
        } as AssessmentLeftNavLink;
        deps = {
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            navLinkHandler: navLinkHandlerMock,
        } as AssessmentLeftNavDeps;
        props = {
            deps,
            selectedKey: 'some key',
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            assessmentsProvider: assessmentsProviderStub,
            assessmentsData: assessmentsDataStub,
            featureFlagStoreData: {},
            expandedTest,
        };

        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildOverviewLink(
                    deps,
                    navLinkHandlerMock.onOverviewClick,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    0,
                ),
            )
            .returns(() => linkStub);
    });

    it('renders with reflow feature flag enabled', () => {
        props.featureFlagStoreData[FeatureFlags.reflowUI] = true;

        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildReflowAssessmentTestLinks(
                    deps,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    1,
                    expandedTest,
                ),
            )
            .returns(() => [linkStub]);

        const actual = shallow(<AssessmentLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });

    it('renders with reflow feature flag disabled', () => {
        props.featureFlagStoreData[FeatureFlags.reflowUI] = false;

        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildAssessmentTestLinks(
                    deps,
                    navLinkHandlerMock.onAssessmentTestClick,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    1,
                ),
            )
            .returns(() => [linkStub]);

        const actual = shallow(<AssessmentLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
