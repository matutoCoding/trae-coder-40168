import type { AudienceGroup, ContactPurpose, ContactRecord } from '@/types';

export const audienceGroups: AudienceGroup[] = [
  {
    id: 'hypertension',
    name: '高血压复购会员',
    description: '近3个月购买过降压药的会员',
    icon: 'heart-pulse'
  },
  {
    id: 'personal-account',
    name: '个账支付会员',
    description: '近期使用过医保个人账户支付的会员',
    icon: 'credit-card'
  },
  {
    id: 'family-binding',
    name: '家庭账户咨询会员',
    description: '咨询过家庭账户绑定的会员',
    icon: 'users'
  }
];

export const contactPurposes: ContactPurpose[] = [
  {
    id: 'expiry-reminder',
    name: '权益到期提醒',
    description: '提醒会员个账权益即将到期'
  },
  {
    id: 'pharmacist-appointment',
    name: '药师服务预约',
    description: '邀请会员预约药师咨询服务'
  },
  {
    id: 'repurchase',
    name: '健康品类复购',
    description: '提醒会员补充常用药品'
  },
  {
    id: 'policy-explain',
    name: '政策解释',
    description: '解读医保个人账户政策'
  }
];

export const mockContactRecords: ContactRecord[] = [
  {
    id: '1',
    audienceId: 'hypertension',
    purposeId: 'expiry-reminder',
    scriptVersion: 'gentle',
    contactDate: '2026-06-15',
    sentCount: 120,
    consultationCount: 35,
    visitCount: 22,
    redemptionCount: 18
  },
  {
    id: '2',
    audienceId: 'hypertension',
    purposeId: 'expiry-reminder',
    scriptVersion: 'professional',
    contactDate: '2026-06-15',
    sentCount: 120,
    consultationCount: 42,
    visitCount: 28,
    redemptionCount: 24
  },
  {
    id: '3',
    audienceId: 'hypertension',
    purposeId: 'expiry-reminder',
    scriptVersion: 'family',
    contactDate: '2026-06-15',
    sentCount: 120,
    consultationCount: 28,
    visitCount: 18,
    redemptionCount: 15
  },
  {
    id: '4',
    audienceId: 'personal-account',
    purposeId: 'pharmacist-appointment',
    scriptVersion: 'gentle',
    contactDate: '2026-06-18',
    sentCount: 85,
    consultationCount: 28,
    visitCount: 19,
    redemptionCount: 14
  },
  {
    id: '5',
    audienceId: 'personal-account',
    purposeId: 'pharmacist-appointment',
    scriptVersion: 'professional',
    contactDate: '2026-06-18',
    sentCount: 85,
    consultationCount: 35,
    visitCount: 25,
    redemptionCount: 20
  },
  {
    id: '6',
    audienceId: 'personal-account',
    purposeId: 'pharmacist-appointment',
    scriptVersion: 'family',
    contactDate: '2026-06-18',
    sentCount: 85,
    consultationCount: 22,
    visitCount: 15,
    redemptionCount: 11
  },
  {
    id: '7',
    audienceId: 'family-binding',
    purposeId: 'policy-explain',
    scriptVersion: 'gentle',
    contactDate: '2026-06-20',
    sentCount: 60,
    consultationCount: 18,
    visitCount: 12,
    redemptionCount: 8
  },
  {
    id: '8',
    audienceId: 'family-binding',
    purposeId: 'policy-explain',
    scriptVersion: 'professional',
    contactDate: '2026-06-20',
    sentCount: 60,
    consultationCount: 25,
    visitCount: 16,
    redemptionCount: 12
  },
  {
    id: '9',
    audienceId: 'family-binding',
    purposeId: 'policy-explain',
    scriptVersion: 'family',
    contactDate: '2026-06-20',
    sentCount: 60,
    consultationCount: 20,
    visitCount: 14,
    redemptionCount: 10
  }
];
