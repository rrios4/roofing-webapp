import React from 'react';
import { Document } from '@react-pdf/renderer';
import { CoverPage } from './proposal-doc/cover-page';
import { IntroductionPage } from './proposal-doc/introduction-page';
import { TechniquesPage } from './proposal-doc/techniques-page';
import { MaterialsPage } from './proposal-doc/materials-page';
import { ProjectDetailsPage } from './proposal-doc/project-details-page';
import { PlanOfActionPage } from './proposal-doc/plan-of-action-page';
import { AcceptancePage } from './proposal-doc/acceptance-page';
import { WaiverPage } from './proposal-doc/waiver-page';
import { TermsPage } from './proposal-doc/terms-page';
import { ProposalDocumentData } from './proposal-doc/proposal-types';

export type { ProposalDocumentData } from './proposal-doc/proposal-types';

interface ProposalDocumentProps {
  quote: ProposalDocumentData;
}

export const ModernProposalDocument: React.FC<ProposalDocumentProps> = ({ quote }) => (
  <Document>
    <CoverPage quote={quote} />
    <IntroductionPage quote={quote} />
    <TechniquesPage />
    <MaterialsPage quote={quote} />
    <ProjectDetailsPage />
    <PlanOfActionPage />
    <AcceptancePage quote={quote} />
    <WaiverPage quote={quote} />
    <TermsPage />
  </Document>
);

export default ModernProposalDocument;
