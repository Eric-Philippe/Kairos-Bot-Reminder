import canvas from "canvas";
import { AttachmentBuilder } from "discord.js";
import DateWorker from "../utils/date.worker";
import { IMG } from "../assets/LOGOS.json";

import { Remindus } from "src/tables/remindus/remindus";

const RemindusDisplay = async (
  remindme: Remindus
): Promise<AttachmentBuilder> => {
  const width = 6912;
  const height = 3456;

  const canva = canvas.createCanvas(width, height);
  const ctx = canva.getContext("2d");

  const background = await canvas.loadImage(IMG.BACKGROUND_US);
  ctx.drawImage(background, 0, 0, canva.width, canva.height);

  //ctx.strokeStyle = "#74037b";
  //ctx.strokeRect(2550, 1240, 3000, 1200);

  // Place the content of the reminder in order to fit in the rectangle in 2550, 1240 with dimension as 3000, 1200
  // Create new lines when the text is too long
  // Don't go over 3 lines
  // Don't go over a font of 240px

  const content = remindme.content;
  const contentArray = content.split(" ");
  if (contentArray.length > 1) {
    let line = "";
    let lineArray = [];
    let lineCount = 0;
    let fontSize = 240;
    let font = `bold ${fontSize}px sans-serif`;
    ctx.font = font;
    for (let i = 0; i < contentArray.length; i++) {
      const word = contentArray[i];
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > 3000 && i > 0) {
        lineArray.push(line);
        line = word + " ";
        lineCount++;
      } else {
        line = testLine;
      }
    }
    lineArray.push(line);
    lineCount++;

    if (lineCount > 3) {
      lineCount = 3;
      lineArray = lineArray.slice(0, 3);
    }

    const lineHeight = fontSize + 20;
    let y = 1240 + lineHeight * lineCount;
    for (let i = lineArray.length - 1; i >= 0; i--) {
      const line = lineArray[i];
      y -= lineHeight;
      ctx.font = font;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(line, 2550, y + fontSize);
    }
  } else {
    ctx.font = "bold 240px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(content, 2550, 1240 + 240);
  }

  //ctx.strokeStyle = "#74037b";
  //ctx.strokeRect(2100, 2900, 2000, 300);

  ctx.font = "bold 188px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    DateWorker.dateToReadable(remindme.targetDate),
    2100,
    2930 + 188
  );

  const attachment = new AttachmentBuilder(canva.toBuffer());

  return attachment;
};

export default RemindusDisplay;
