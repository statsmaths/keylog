#' Read a CSV file containing keylog data.
#'
#' The file is a standard CSV file and can generally be read with existing
#' methods. This function simply makes sure that the correct column types
#' are selected when loading the file and fills in the spaces and new line
#' characaters correctly.
#'
#' @param input          path to the csv file containing the data.
#'
#' @return  a tibble object containing the keylog data.
#'
#' @author Taylor B. Arnold, \email{taylor.arnold@@acm.org}
#'
#'@examples
#'example_path <- system.file("keylogs-1622057428556.csv", package = "keylog")
#'klog_readfile(example_path)
#'
#' @export
klog_readfile <- function(input) {
  dt <- readr::read_csv(input, col_types = "dcccllllldd", na = character())
  dt$key[dt$key_code == "Space"] <- " "
  dt$key[dt$key_code == "Enter"] <- "\n"
  return(dt)
}

#' Augement keylog data to the level of individual keys.
#'
#' Returns a dataset with one row for each individual key that was typed.
#' Information about mouse clicks are not included. Key states refer to the
#' state when the key was pressed. Times are all recentered to the start of
#' the data. Useful for studing individual keys and bursts of activity.
#'
#' @param dt          data frame containing the keylogs.
#'
#' @return  a tibble object containing the key-based data.
#' @author Taylor B. Arnold, \email{taylor.arnold@@acm.org}
#'@examples
#'example_path <- system.file("keylogs-1622057428556.csv", package = "keylog")
#'dt <- klog_readfile(example_path)
#'klog_events(dt)
#' @export
klog_events <- function(dt, rename = TRUE)
{
  dt$time <- dt$time - min(dt$time)

  # seperate keys presses (up and down) from other events
  dt_key <- dplyr::filter(dt, type %in% c("up", "down"))
  dt_oth <- dplyr::filter(dt, !(type %in% c("up", "down", "input")))

  # process key up and down
  dt_key <- dplyr::arrange(dt_key, time)
  dt_key <- dplyr::group_by(dt_key, key_code)
  dt_key <- dplyr::mutate(
    dt_key,
    type_next = dplyr::lead(type, n = 1),
    time_up = dplyr::lead(time, n = 1)
  )
  dt_key <- dplyr::filter(dt_key, type == "down")
  dt_key <- dplyr::ungroup(dt_key)
  dt_key$modkey <- (stringi::stri_length(dt_key$key) > 1L)
  dt_key <- dplyr::select(
    dt_key, time, time_up, key, key_code, modkey, range_start, range_end
  )

  # process other events
  dt_oth <- dplyr::filter(dt_oth, type == "paste")
  dt_oth$time_up <- NA_integer_
  dt_oth$modkey <- FALSE
  dt_oth <- dplyr::select(
    dt_oth, time, time_up, key, key_code, modkey, range_start, range_end
  )

  # combine and sort the data
  dt_new <- dplyr::bind_rows(dt_key, dt_oth)
  dt_new <- dplyr::arrange(dt_new, time)

  return(dt_new)
}

#' What is there here?
#'
#' Returns a dataset with one row for each individual key that was typed.
#' Information about mouse clicks are not included. Key states refer to the
#' state when the key was pressed. Times are all recentered to the start of
#' the data. Useful for studing individual keys and bursts of activity.
#'
#' @param dt          data frame containing the keylogs.
#'
#' @return  a tibble object containing the running text.
#' @author Taylor B. Arnold, \email{taylor.arnold@@acm.org}
#'@examples
#'example_path <- system.file("keylogs-1621971722509.csv", package = "keylog")
#'dt <- klog_readfile(example_path)
#'klog_create_text(dt)
#' @export
klog_create_text <- function(dt)
{
  input <- dplyr::filter(dt, type == "input")

  index <- which(
    (input$range_start == input$range_end) &
    (input$key_code == "deleteContentBackward") &
    (input$range_start == 1L)
  )
  input$range_start[index] <- input$range_start[index] - 1
  input$key[input$key == ""] <- " "

  cur_text <- c("")
  for (i in seq_len(nrow(input)))
  {
    if (input$key_code[i] %in% c("insertText", ""))
    {
      stringi::stri_sub(
        cur_text[i], input$range_end[i], input$range_start[i]
      ) <- input$key[i]
    }
    if (input$key_code[i] == "deleteContentBackward")
    {
      stringi::stri_sub(
        cur_text[i], input$range_end[i] + 1L, input$range_start[i] + 1L
      ) <- ""
    }

    if (i != nrow(input))
    {
      cur_text <- c(cur_text, cur_text[length(cur_text)])
    }
  }

  dt_new <- tibble::tibble(
    time = input$time,
    key_code = input$key_code,
    current_text = cur_text
  )
  return(dt_new)
}
