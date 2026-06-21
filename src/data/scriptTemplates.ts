import type { ScriptTemplate, AudienceId, PurposeId, ScriptVersion } from '@/types';

const versionConfig: Record<ScriptVersion, { name: string; color: string }> = {
  gentle: { name: '温和提醒版', color: 'gentle' },
  professional: { name: '药师专业版', color: 'primary' },
  family: { name: '家属协助版', color: 'accent' }
};

const commonForbiddenPromises = [
  '不得承诺"可以医保报销"，个账支付不等于医保报销',
  '不得承诺"可以返钱"或"账户余额可提现"',
  '不得夸大药品疗效或承诺治愈效果'
];

const generateId = (audience: AudienceId, purpose: PurposeId, version: ScriptVersion) => 
  `${audience}-${purpose}-${version}`;

interface ScriptContent {
  content: string;
  forbiddenPromises: string[];
}

const scriptContents: Record<AudienceId, Record<PurposeId, Record<ScriptVersion, ScriptContent>>> = {
  'hypertension': {
    'expiry-reminder': {
      gentle: {
        content: `亲爱的会员您好，这里是【门店地址】的温馨提醒。您的医保个人账户年度权益将于本月底到期，账户内的余额可用于购买常用药品和健康用品。

您常购的降压药库存充足，欢迎您在方便的时候到店选购，或在【可咨询时间】致电咨询。

如需帮助，请随时联系我们的【药师姓名】药师。祝您身体健康！`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得暗示权益到期后余额会清零（具体政策以当地医保规定为准）'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

根据医保个人账户管理规定，您的年度权益即将到期。您账户内的历年结余可用于支付：
• 降压药物及并发症预防用药
• 血压计、血糖仪等家用医疗设备
• 医师开具的处方药品

建议您定期监测血压，如需调整用药方案，可在【可咨询时间】预约我的一对一用药咨询服务。

提醒：个账支付属于个人医保账户使用，并非医保报销范畴。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"所有药品都可以用个账支付"（需符合医保目录规定）'
        ]
      },
      family: {
        content: `您好，这是【门店地址】给您家属的健康提醒。

您家人的医保个人账户权益即将到期，为了家人的健康，建议提醒TA：
1. 常用降压药是否需要备足
2. 是否需要做一次血压检测
3. 考虑为家人配备家庭血压计

【药师姓名】药师在【可咨询时间】可为您家人提供免费的用药指导。如有疑问，可随时联系我们。

*温馨提示：医保个账是专款专用的医疗保障账户，用于支付合规医药费用。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得鼓励家属共用个人账户（需符合当地家庭账户绑定政策）'
        ]
      }
    },
    'pharmacist-appointment': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】关心您的健康。

我们的执业药师【药师姓名】近期开设了高血压健康管理咨询服务，您可以在【可咨询时间】预约，免费获得：
• 血压测量与记录分析
• 常用降压药用药指导
• 饮食和运动建议

名额有限，如需预约请回复本消息或到店咨询。祝您血压平稳，身体健康！`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺咨询后"一定能降血压"或"可以停药"'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

根据您的购药记录，您长期服用降压药物。为了确保用药安全有效，诚邀您在【可咨询时间】预约我的一对一用药咨询，服务内容包括：
• 血压控制情况评估
• 药物相互作用排查
• 服药依从性指导
• 并发症风险筛查

本服务为会员专享，不额外收费。个账余额可支付咨询期间的相关药品费用。

*注：药师咨询不能替代医师诊断，如有不适请及时就医。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺咨询服务可以用医保报销'
        ]
      },
      family: {
        content: `您好，这是【门店地址】给您家属的健康服务提醒。

您家人长期服用降压药物，我们特别为家属准备了"家庭健康管理"服务。【药师姓名】药师可在【可咨询时间】为您讲解：
• 如何帮助家人规律服药
• 家庭血压监测的正确方法
• 发现哪些情况需要及时就医

欢迎陪同家人一同到店咨询，让我们一起守护家人健康。

*提示：药师服务旨在提升用药安全，不涉及诊断和治疗承诺。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"参与管理就可以停药减药"'
        ]
      }
    },
    'repurchase': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】提醒您：

根据您的购药记录，您常用的降压药即将用完。为避免中断服药影响血压控制，建议您提前备足药品。

到店购买可用医保个人账户支付，【药师姓名】药师在【可咨询时间】可为您提供用药咨询。

祝您健康！`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"用个账买降压药比现金便宜"'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

查看您的用药记录，您的降压药物即将服完。持续规律服药对高血压管理非常重要。

目前库存充足的降压药包括您常用的品种，您可在方便时到店购买，使用医保个人账户支付。

如需调整用药或有其他疑问，可在【可咨询时间】预约咨询。

*提醒：请按医嘱服药，不要自行增减药量或停药。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得暗示"囤药更划算"或鼓励超量购买'
        ]
      },
      family: {
        content: `您好，这是【门店地址】给您家属的温馨提醒：

您家人常用的降压药即将用完，为确保持续治疗，请提醒TA及时购药。使用医保个人账户支付安全便捷。

【药师姓名】药师在【可咨询时间】可解答用药相关问题。如需帮助，也可陪同家人一起到店，我们会为您详细讲解用药注意事项。

*请遵医嘱购药，确保用药安全。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得建议家属代配处方药（需凭有效处方）'
        ]
      }
    },
    'policy-explain': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】为您解读医保个人账户政策：

医保个人账户是您的专属医疗保障账户，可用于：
• 在定点药店购买医保目录内药品
• 支付门诊、住院的个人自付部分
• 部分地区可用于家人共济使用

具体使用范围以当地医保政策为准。如有疑问，【药师姓名】药师在【可咨询时间】可为您解答。

*温馨提示：个账资金专款专用，不能提现或挪作他用。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得解释超出本地区的医保政策'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

关于医保个人账户的使用，为您说明如下：

【可使用范围】
1. 定点零售药店购药费用
2. 门诊、急诊医疗费用
3. 基本医疗保险统筹基金起付标准以下的医疗费

【使用注意事项】
• 仅限本人使用（符合家庭共济政策的除外）
• 不得用于购买保健品、化妆品等非医疗用品
• 不得套取现金

如需了解更多，可在【可咨询时间】到店咨询。

*政策解读仅供参考，以医保部门最新规定为准。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"所有药品都可用个账支付"（需符合医保目录）'
        ]
      },
      family: {
        content: `您好，【门店地址】为您解读医保个人账户家庭共济政策：

部分地区已开通医保个人账户家庭共济功能，职工医保参保人员的个人账户结余资金，可用于支付配偶、父母、子女的医疗费用。

【使用条件】
• 需在医保经办机构办理绑定手续
• 仅限定点医药机构使用
• 支付范围符合医保规定

【药师姓名】药师在【可咨询时间】可为您讲解绑定流程和注意事项。

*具体政策以当地医保部门规定为准。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"所有地区都支持家庭共济"',
          '不得代办绑定手续'
        ]
      }
    }
  },
  'personal-account': {
    'expiry-reminder': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】温馨提醒：

您的医保个人账户年度使用权益即将到期，为了充分利用您的医疗保障，建议您：
• 检查常用药品是否需要补充
• 考虑配备家庭常备药箱
• 如需健康咨询，【药师姓名】药师在【可咨询时间】为您服务

账户余额可在定点药店使用，欢迎您随时到店。

*个账资金属于个人医疗保障，专款专用。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得暗示"到期不清零就损失了"（历年结余可累积）'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

根据医保政策，您的个人账户年度权益即将到期。为您说明如下：
1. 个人账户分为当年账户和历年账户
2. 当年账户结余可按规定结转至历年账户
3. 历年账户可用于支付更多医疗费用

历年账户可支付的范围包括：
• 医保目录内的药品和医疗器械
• 门诊、住院的个人自负部分
• 部分地区支持家庭共济

如有疑问，可在【可咨询时间】到店咨询。

*政策以当地医保部门规定为准。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"历年账户可以随意使用"'
        ]
      },
      family: {
        content: `您好，【门店地址】给您的家庭健康提醒：

您家人的医保个人账户年度权益即将到期，建议提醒TA：
1. 检查常用药品是否充足
2. 为家中老人、孩子准备常备药品
3. 了解家庭共济使用政策

【药师姓名】药师在【可咨询时间】可为您讲解如何合理使用个账资金，为全家健康保驾护航。

*温馨提示：家庭共济需符合当地医保政策规定。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得建议将个账资金用于非参保家庭成员（未绑定情况下）'
        ]
      }
    },
    'pharmacist-appointment': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】推出会员专享药师咨询服务。

我们的执业药师【药师姓名】可在【可咨询时间】为您提供：
• 用药咨询与指导
• 家庭药箱整理建议
• 保健品与药品搭配注意事项

会员服务免费，到店即可咨询。个人账户可支付咨询相关的药品费用。

期待您的光临！`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺咨询服务可"治愈"或"根治"疾病'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

诚邀您在【可咨询时间】预约我的专业咨询服务，内容包括：
• 慢病用药管理与优化
• 多种药物联合使用评估
• 特殊人群用药注意事项
• 不良反应识别与应对

本服务为会员专享，您的医保个人账户可支付咨询期间的相关药品和医疗器械费用。

*药师咨询不能替代医师诊断，如有不适请及时就医。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺咨询费用可以用医保报销'
        ]
      },
      family: {
        content: `您好，【门店地址】为您的家庭准备了健康服务。

如果您家人有以下情况，建议陪同TA预约【药师姓名】药师在【可咨询时间】的咨询服务：
• 同时服用多种药物
• 需要长期用药的慢性病患者
• 老人、儿童、孕妇等特殊人群

我们会为您家人提供专业的用药指导，保障用药安全。

*医保个人账户可支付相关药品费用，使用需符合医保规定。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"药师可以调整用药方案"（需医师处方）'
        ]
      }
    },
    'repurchase': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】提醒您及时补充常用药品。

为了您和家人的健康，建议备足：
• 常用感冒药、肠胃药
• 慢性病长期用药
• 创可贴、消毒水等家庭常备用品

使用医保个人账户支付安全便捷，【药师姓名】药师在【可咨询时间】可为您推荐合适的药品。

祝您和家人健康！`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得鼓励"多买多优惠"式的囤药行为'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

根据您的购药记录，建议您适时补充以下药品：
• 日常用药：感冒药、止痛药、肠胃药
• 特殊用药：根据您的健康状况
• 家庭常备：体温计、口罩、消毒用品

以上药品均可使用医保个人账户支付（符合医保目录的品种）。

如需用药咨询，可在【可咨询时间】到店，我会为您提供专业建议。

*请按需购买，合理储备。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得推荐超出医保目录的药品使用个账支付'
        ]
      },
      family: {
        content: `您好，【门店地址】提醒您为家人准备常用药品。

建议为家中老人、孩子备足：
• 感冒发烧常用药
• 肠胃不适药品
• 外用药和急救用品

使用医保个人账户支付方便快捷，【药师姓名】药师在【可咨询时间】可为您推荐适合全家使用的常备药品。

温馨提示：药品有保质期，请按需购买，定期检查。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得建议为未参保家属使用个账购药（未绑定家庭共济情况下）'
        ]
      }
    },
    'policy-explain': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】为您解读医保个人账户：

【什么是医保个人账户】
是职工基本医疗保险的组成部分，专门用于支付您的医疗费用。

【可使用范围】
• 定点药店购药
• 门诊费用支付
• 住院个人自付部分

【使用须知】
• 仅限本人使用（家庭共济除外）
• 不能提现、不能转借
• 专款专用，保障您的医疗需求

【药师姓名】药师在【可咨询时间】可解答您的疑问。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得做出与官方政策不符的解释'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

关于医保个人账户的使用，为您做专业解读：

【账户构成】
- 个人缴费部分：全部计入个人账户
- 单位缴费部分：按比例划入个人账户（根据年龄）

【使用规定】
1. 在定点零售药店购买医保目录内药品
2. 支付门诊、急诊医疗费用
3. 支付住院起付线以下及个人负担部分
4. 部分地区可用于家人共济

【注意事项】
• 不得用于购买食品、保健品、化妆品等
• 不得套取现金或转借他人
• 超范围使用可能影响您的医保待遇

如需了解更多，可在【可咨询时间】到店咨询。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"所有药店都支持个账支付"（仅限定点药店）'
        ]
      },
      family: {
        content: `您好，【门店地址】为您解读医保个人账户家庭共济政策：

如果您已办理家庭共济绑定，您的个人账户资金可用于支付：
• 配偶的门诊和购药费用
• 子女的医疗费用
• 父母的医疗费用

【办理流程】
1. 到当地医保经办机构办理
2. 提供亲属关系证明
3. 完成绑定后即可使用

【药师姓名】药师在【可咨询时间】可为您详细讲解，帮助您合理使用个账资金，惠及全家。

*具体政策以当地医保部门规定为准。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"所有地区都已开通家庭共济"',
          '不得代办绑定业务'
        ]
      }
    }
  },
  'family-binding': {
    'expiry-reminder': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】温馨提醒：

您之前咨询过医保个人账户家庭共济绑定。现在提醒您，您的个人账户年度权益即将到期。

如果您已完成绑定，可使用个账资金为家人支付合规医疗费用；如果尚未办理，建议您了解当地政策。

【药师姓名】药师在【可咨询时间】可为您解答绑定相关问题。

*个账资金专款专用，请合理使用。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得暗示"绑定后家人就能随意使用您的个账"'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

您之前咨询过医保个人账户家庭共济绑定，现提醒您：

【绑定后的使用范围】
1. 支付配偶、子女、父母在定点医药机构发生的个人负担医疗费用
2. 支付医保目录内的药品费用
3. 支付门诊、住院的个人自付部分

【使用注意事项】
• 主账户人承担共济使用的全部责任
• 共济使用需符合医保规定
• 共济使用记录会留存备查

如需了解更多，可在【可咨询时间】到店咨询。

*政策以当地医保部门规定为准。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"绑定后所有家人的费用都能支付"'
        ]
      },
      family: {
        content: `您好，【门店地址】给您的家庭健康提醒：

您之前咨询过医保家庭共济绑定，现在提醒您：

如果已绑定，记得使用个账资金为家人支付医疗费用；如果还在考虑，建议您了解：
• 绑定后可以用您的个账为家人购药
• 可以支付家人的门诊费用
• 具体以当地医保政策为准

【药师姓名】药师在【可咨询时间】可为您详细讲解，让您的个账资金更好地守护全家健康。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得鼓励绑定给不符合条件的亲属使用'
        ]
      }
    },
    'pharmacist-appointment': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】关心您和家人的健康。

我们的执业药师【药师姓名】特别准备了"家庭健康管理"咨询服务，您可以在【可咨询时间】预约，免费获得：
• 全家用药方案梳理
• 家庭药箱整理建议
• 医保个账家庭共济使用指导

欢迎您和家人一同到店咨询。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺咨询可以"替代看病"'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

您之前咨询过医保家庭共济绑定，诚邀您在【可咨询时间】预约我的一对一咨询服务：

【服务内容】
1. 家庭成员用药评估
2. 药物相互作用排查
3. 个账共济使用规划
4. 家庭健康管理建议

特别适合有老人、孩子或慢病患者的家庭。个人账户可支付咨询期间的相关药品费用。

*药师咨询不能替代医师诊断。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺咨询费用可医保报销'
        ]
      },
      family: {
        content: `您好，【门店地址】为您准备了家庭健康咨询服务。

如果您家中有老人、孩子或慢病患者，建议您陪同家人一起预约【药师姓名】药师在【可咨询时间】的咨询服务：
• 了解老人多重用药注意事项
• 学习儿童安全用药知识
• 规划全家的健康管理方案

让专业药师帮助您更好地守护家人健康。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"家庭咨询可以包治百病"'
        ]
      }
    },
    'repurchase': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】提醒您为家人备足常用药品。

使用医保个人账户（如已绑定家庭共济）可以为家人支付：
• 老人常用的降压药、降糖药
• 孩子的感冒发烧药
• 全家人的常备药品

【药师姓名】药师在【可咨询时间】可为您推荐适合全家的常备药品。

祝您和家人身体健康！`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得鼓励为未绑定共济的家属使用个账购药'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

如果您已办理医保家庭共济绑定，可使用个人账户为家人支付医保目录内的药品费用。

为您建议的常备药品包括：
• 【成人】：降压药、降糖药、心血管用药（凭处方）
• 【儿童】：退烧药、感冒药、肠胃药
• 【全家】：外用药、消毒用品

如需具体用药建议，可在【可咨询时间】到店咨询。

*处方药需凭医师处方购买。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得推荐超量购买或囤积药品'
        ]
      },
      family: {
        content: `您好，【门店地址】提醒您为家中老人孩子准备常用药品。

如果已绑定医保家庭共济，可使用个人账户为家人支付：
• 老人的慢性病用药
• 孩子的常用药品
• 家庭急救用品

【药师姓名】药师在【可咨询时间】可为您详细讲解各年龄段用药注意事项，确保全家用药安全。

*请按需购买，定期检查药品保质期。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得建议为未参保家属使用个账购药'
        ]
      }
    },
    'policy-explain': {
      gentle: {
        content: `亲爱的会员您好，【门店地址】为您解读医保个人账户家庭共济政策：

【什么是家庭共济】
职工医保参保人员的个人账户结余资金，可用于支付配偶、父母、子女的医疗费用。

【如何办理】
1. 携带身份证、亲属关系证明
2. 到当地医保经办机构办理
3. 完成绑定后即时生效

【药师姓名】药师在【可咨询时间】可为您解答疑问。

*具体政策以当地医保部门规定为准。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得承诺"所有地区都已开通此政策"'
        ]
      },
      professional: {
        content: `尊敬的会员您好，我是【门店地址】的执业药师【药师姓名】。

针对您之前咨询的医保家庭共济绑定问题，为您做详细解读：

【适用条件】
1. 主账户人为职工医保参保人员
2. 共济对象为配偶、父母、子女
3. 共济对象需为基本医疗保险参保人员

【使用范围】
• 定点医疗机构的门诊、住院费用中个人负担部分
• 定点零售药店的药品费用
• 需符合医保目录规定

【办理材料】
• 本人及被绑定人身份证
• 户口簿或结婚证等亲属关系证明
• 填写《个人账户家庭共济绑定申请表》

如需了解更多，可在【可咨询时间】到店咨询。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得代办绑定业务',
          '不得承诺绑定后"可以随时解绑"'
        ]
      },
      family: {
        content: `您好，【门店地址】为您的家庭解读医保家庭共济政策：

【绑定后您可以】
✅ 用您的个账为配偶支付门诊费用
✅ 为孩子购买医保目录内药品
✅ 为父母支付慢性病用药费用

【温馨提示】
• 绑定后您承担共济使用的全部责任
• 共济使用记录会留存备查
• 建议合理规划使用额度

【药师姓名】药师在【可咨询时间】可为您详细讲解绑定流程，帮助您更好地为家人提供医疗保障。

*政策以当地医保部门最新规定为准。`,
        forbiddenPromises: [
          ...commonForbiddenPromises,
          '不得暗示"绑定后家人的所有费用都由您支付"'
        ]
      }
    }
  }
};

export const generateScriptTemplates = (audience: AudienceId, purpose: PurposeId): ScriptTemplate[] => {
  const versions: ScriptVersion[] = ['gentle', 'professional', 'family'];
  
  return versions.map(version => {
    const content = scriptContents[audience][purpose][version];
    const config = versionConfig[version];
    
    return {
      id: generateId(audience, purpose, version),
      audienceId: audience,
      purposeId: purpose,
      version,
      versionName: config.name,
      versionColor: config.color,
      content: content.content,
      forbiddenPromises: content.forbiddenPromises
    };
  });
};

export const getAllScriptTemplates = (): ScriptTemplate[] => {
  const audiences: AudienceId[] = ['hypertension', 'personal-account', 'family-binding'];
  const purposes: PurposeId[] = ['expiry-reminder', 'pharmacist-appointment', 'repurchase', 'policy-explain'];
  const templates: ScriptTemplate[] = [];
  
  audiences.forEach(audience => {
    purposes.forEach(purpose => {
      templates.push(...generateScriptTemplates(audience, purpose));
    });
  });
  
  return templates;
};
