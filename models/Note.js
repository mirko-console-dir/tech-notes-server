const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // refer to the user schema
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket", // create a ticket field in the schema that is a seq number
  id: "ticketNums", // this will crete an other collection (Counter) with all the id of the counter
  start_seq: 500,
});

module.exports = mongoose.model("Note", noteSchema);
