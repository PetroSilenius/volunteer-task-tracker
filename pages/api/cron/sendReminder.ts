import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail, {MailDataRequired} from '@sendgrid/mail'
import { getTasksForTomorrow } from '@/lib/db';
import { getUser } from '@/lib/user';
 
type ResponseData = {
  message: string;
};

const sendTaskReminder = async (task: Task, hostUrl: string) => {
  const user = await getUser(task.user_id);

  const msg: MailDataRequired = {
    to: user.emailAddresses[0].emailAddress,
    from: process.env.SENDGRID_SENDER_ADDRESS ?? '',
    templateId: process.env.SENDGRID_TEMPLATE_ID ?? '',
    dynamicTemplateData: {
      first_name: user.firstName,
      confirm_url: `${hostUrl}/confirm/${task.id}`
    }
  }
  await sgMail.send(msg);
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.query.key !== process.env.SECRET_CRON_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  sgMail.setApiKey(String(process.env.SENDGRID_API_KEY))

  const {rows: tasksForTomorrow} = await getTasksForTomorrow();
  if (tasksForTomorrow.length === 0) {
    return res.status(200).json({ message: 'No tasks for tomorrow' });
  }

  const hostUrl = `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`;
  const response = await Promise.all(tasksForTomorrow.map(task => sendTaskReminder(task, hostUrl)));
  return res.status(200).json({ message: `${response.length} emails sent`})
}