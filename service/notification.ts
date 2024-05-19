import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import { Alert, Platform } from 'react-native';
import { TaskType } from '@/interfaces/task';

export async function checkNotificationAllowed() {
  const settings = await Notifications.getPermissionsAsync();
  const allowed = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  console.log(`Notif Granted? ${allowed}`)
  if (!allowed && settings.canAskAgain) {
    const result = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    console.log(`Ask Again Result? ${result.granted}`)
    if (result.granted) return true
    else return false
  }
  return allowed;
}

export async function scheduleNotifications(task: TaskType) {
  const allowed = checkNotificationAllowed();

  if (!allowed) {
    return { success: false, reason: 'Notification not allowed!' }
  }

  const time = new Date(task.datetime);
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  const diffMin = diff / (1000 * 60)

  console.log(`DIF ${diff} SEC ${diff / 1000} MIN ${diffMin}`)
  // If time has passed just trigger now
  if (diffMin <= 0) {
    const nowIdentifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: task.title,
        body: task.details ?? "You got a reminder from Remember Me :)",
        interruptionLevel: 'timeSensitive',
        priority: 'max',
      },
      trigger: null,
    });
    console.log(`NOW IDENTIFIER: ${nowIdentifier}`)
    return { success: true }
  }
  // If time is about to pass closely (5 min) use the simplified trigger
  else if (diffMin <= 5) {
    const seconds = diff / 1000
    const closeIdenfitier = await Notifications.scheduleNotificationAsync({
      content: {
        title: task.title,
        body: task.details ?? "You got a reminder from Remember Me :)",
        interruptionLevel: 'timeSensitive',
        priority: 'max',
      },
      trigger: { seconds: seconds },
    })
    console.log(`ClOSE IDENTIFIER: ${closeIdenfitier}`)
    return { success: true }
  }
  // Long enough schedule notification
  else {
    console.log(`SCHEDULE A NOTIFICATION AT ${time.toISOString()} CURRENT TIME ${new Date().toISOString()}`)
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: task.title,
        body: task.details ?? "You got a reminder from Remember Me :)",
        interruptionLevel: 'timeSensitive',
        priority: 'max',
      },
      trigger: time,
      identifier: task.id,
    });
    console.log(`TASK ID ${task.id}`)
    console.log(`NOTIFICATION ID ${identifier}`)
    if (!identifier) { return { success: false, reason: 'Notification failed to be created!' } }
    else return { success: true }
  }
}

export async function deleteNotifications(id: string) {
  console.log(`NOTIF ${id} deletion requested`)
  await Notifications.cancelScheduledNotificationAsync(id)
}

export async function rescheduleNotification(task: TaskType) {
  console.log('RESCHEDULING')
  await Notifications.cancelScheduledNotificationAsync(task.id)
  await scheduleNotifications(task)
}