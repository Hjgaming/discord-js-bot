const { SlashCommand } = require("@src/structures");
const { MessageEmbed, CommandInteraction } = require("discord.js");
const { MESSAGES, EMBED_COLORS } = require("@root/config.js");
const { getJson } = require("@utils/httpUtils");

const animals = ["cat", "dog", "panda", "fox", "red_panda", "koala", "bird", "raccoon", "kangaroo"];
const BASE_URL = "https://some-random-api.ml/animal";

module.exports = class AnimalCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      name: "animal",
      description: "shows a random animal image",
      enabled: true,
      cooldown: 5,
      category: "FUN",
      options: [
        {
          name: "name",
          description: "animal type",
          type: "STRING",
          required: true,
          choices: animals.map((animal) => ({ name: animal, value: animal })),
        },
      ],
    });
  }

  /**
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    const choice = interaction.options.getString("name");

    const response = await getJson(`${BASE_URL}/${choice}`);
    if (!response.success) return MESSAGES.API_ERROR;

    const imageUrl = response.data?.image;
    const embed = new MessageEmbed()
      .setColor(EMBED_COLORS.TRANSPARENT_EMBED)
      .setImage(imageUrl)
      .setFooter(`Requested by ${interaction.user.tag}`);

    await interaction.followUp({ embeds: [embed] });
  }
};
