import PropTypes from 'prop-types'
import PageView from '@src/views/common/pagination/PageView'
import BreakView from '@src/views/common/pagination/BreakView'
import { useEffect, useState } from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Select from 'react-select'
// import { Row } from 'reactstrap'
const CustomPagination = ({
  totalRows,
  pageCount,
  pageRangeDisplayed,
  marginPagesDisplayed,
  previousLabel,
  previousAriaLabel,
  prevRel,
  nextLabel,
  nextAriaLabel,
  nextRel,
  breakLabel,
  onPageChange,
  onPageActive,
  initialPage,
  forcePage,
  disableInitialCallback,
  containerClassName,
  pageClassName,
  pageLinkClassName,
  pageLabelBuilder,
  activeClassName,
  activeLinkClassName,
  previousClassName,
  nextClassName,
  previousLinkClassName,
  nextLinkClassName,
  disabledClassName,
  breakClassName,
  breakLinkClassName,
  extraAriaContext,
  eventListener,
  hrefBuilder,
  ariaLabelBuilder,
  pageRange,
  previousPagesClassName,
  nextPagesClassName,
  previousPagesLinkClassName,
  nextPagesLinkClassName,
  previousPagesLabel,
  previousPagesAriaLabel,
  prevPagesRel,
  nextPagesLabel,
  nextPagesAriaLabel,
  nextPagesRel,
  rowsPerPage,
  rowsPerPageOptions,
  handlePerPage,
  displayUnit
}) => {
  const [currentSelected, setCurrentSelected] = useState(0)

  const previousClasses =
    previousClassName + (currentSelected === 0 ? ` ${disabledClassName}` : '')
  const nextClasses =
    nextClassName +
    (currentSelected === pageCount - 1 ? ` ${disabledClassName}` : '')
  const previousPagesClasses =
    previousPagesClassName + (currentSelected < pageRange ? ` ${disabledClassName}` : '')
  const nextPagesClasses =
    nextPagesClassName +
    (currentSelected >= pageCount - pageRange ? ` ${disabledClassName}` : '')

  const previousAriaDisabled = currentSelected === 0 ? 'true' : 'false'
  const nextAriaDisabled = currentSelected === pageCount - 1 ? 'true' : 'false'
  const previousPagesAriaDisabled = currentSelected < pageRange ? 'true' : 'false'
  const nextPagesAriaDisabled = currentSelected >= pageCount - pageRange ? 'true' : 'false'
  const displayFrom = (currentSelected * rowsPerPage) + 1
  const displayTo = (currentSelected + 1) * (rowsPerPage)

  const callCallback = (selectedItem) => {
    if (
      typeof onPageChange !== 'undefined' &&
      typeof onPageChange === 'function'
    ) {
      onPageChange({ selected: selectedItem })
    }
  }

  const callActiveCallback = (selectedItem) => {
    if (
      typeof onPageActive !== 'undefined' &&
      typeof onPageActive === 'function'
    ) {
      onPageActive({ selected: selectedItem })
    }
  }

  const handlePageSelected = (selected, evt) => {
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false)

    if (selected === currentSelected) {
      callActiveCallback(selected)
      return
    }

    setCurrentSelected(selected)

    // Call the callback with the new selected item:
    callCallback(selected)
  }

  const handlePreviousPage = (evt) => {
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false)
    if (currentSelected > 0) {
      handlePageSelected(currentSelected - 1, evt)
    }
  }

  const handleNextPage = (evt) => {
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false)
    if (currentSelected < pageCount - 1) {
      handlePageSelected(currentSelected + 1, evt)
    }
  }

  const handlePreviousPageRange = (evt) => {
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false)
    if (currentSelected >= pageRange) {
      handlePageSelected(currentSelected - pageRange, evt)
    }
  }

  const handleNextPageRange = (evt) => {
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false)
    if (currentSelected < pageCount - pageRange) {
      handlePageSelected(currentSelected + pageRange, evt)
    }
  }

  const getEventListener = (handlerFunction) => {
    return {
      [eventListener]: handlerFunction
    }
  }

  const getForwardJump = () => {
    const forwardJump = currentSelected + pageRangeDisplayed
    return forwardJump >= pageCount ? pageCount - 1 : forwardJump
  }

  const getBackwardJump = () => {
    const backwardJump = currentSelected - pageRangeDisplayed
    return backwardJump < 0 ? 0 : backwardJump
  }

  const handleBreakClick = (index, evt) => {
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false)
    handlePageSelected(
      currentSelected < index ? getForwardJump() : getBackwardJump(),
      evt
    )
  }

  const hrefBuilderCus = (pageIndex) => {
    if (
      hrefBuilder &&
      pageIndex !== currentSelected &&
      pageIndex >= 0 &&
      pageIndex < pageCount
    ) {
      return hrefBuilder(pageIndex + 1)
    }
  }

  const ariaLabelBuilderCus = (pageIndex) => {
    const selected = pageIndex === currentSelected
    if (
      ariaLabelBuilder &&
      pageIndex >= 0 &&
      pageIndex < pageCount
    ) {
      let label = ariaLabelBuilder(pageIndex + 1, selected)
      // DEPRECATED: The extraAriaContext prop was used to add additional context
      // to the aria-label. Users should now use the ariaLabelBuilder instead.
      if (extraAriaContext && !selected) {
        label = `${label} ${extraAriaContext}`
      }
      return label
    }
  }

  const getPageElement = (index) => {
    return (
      <PageView
        key={index}
        pageSelectedHandler={handlePageSelected.bind(null, index)}
        selected={currentSelected === index}
        pageClassName={pageClassName}
        pageLinkClassName={pageLinkClassName}
        activeClassName={activeClassName}
        activeLinkClassName={activeLinkClassName}
        extraAriaContext={extraAriaContext}
        href={hrefBuilderCus(index)}
        ariaLabel={ariaLabelBuilderCus(index)}
        page={index + 1}
        pageLabelBuilder={pageLabelBuilder}
        getEventListener={getEventListener}
      />
    )
  }

  const pagination = () => {
    const items = []

    if (pageCount <= pageRangeDisplayed) {
      for (let index = 0; index < pageCount; index++) {
        items.push(getPageElement(index))
      }
    } else {
      let leftSide = pageRangeDisplayed / 2
      let rightSide = pageRangeDisplayed - leftSide

      // If the selected page index is on the default right side of the pagination,
      // we consider that the new right side is made up of it (= only one break element).
      // If the selected page index is on the default left side of the pagination,
      // we consider that the new left side is made up of it (= only one break element).
      // eslint-disable-next-line no-mixed-operators
      if (currentSelected > pageCount - pageRangeDisplayed / 2) {
        rightSide = pageCount - currentSelected
        leftSide = pageRangeDisplayed - rightSide
      } else if (currentSelected < pageRangeDisplayed / 2) {
        leftSide = currentSelected
        rightSide = pageRangeDisplayed - leftSide
      }

      let index
      let page
      let breakView
      const createPageView = (index) => getPageElement(index)

      for (index = 0; index < pageCount; index++) {
        page = index + 1

        // If the page index is lower than the margin defined,
        // the page has to be displayed on the left side of
        // the pagination.
        if (page <= marginPagesDisplayed) {
          items.push(createPageView(index))
          continue
        }

        // If the page index is greater than the page count
        // minus the margin defined, the page has to be
        // displayed on the right side of the pagination.
        if (page > pageCount - marginPagesDisplayed) {
          items.push(createPageView(index))
          continue
        }

        // If the page index is near the selected page index
        // and inside the defined range (pageRangeDisplayed)
        // we have to display it (it will create the center
        // part of the pagination).
        if (index >= currentSelected - leftSide && index <= currentSelected + rightSide) {
          items.push(createPageView(index))
          continue
        }

        // If the page index doesn't meet any of the conditions above,
        // we check if the last item of the current "items" array
        // is a break element. If not, we add a break element, else,
        // we do nothing (because we don't want to display the page).
        if (breakLabel && items[items.length - 1] !== breakView) {
          breakView = (
            <BreakView
              key={index}
              breakLabel={breakLabel}
              breakClassName={breakClassName}
              breakLinkClassName={breakLinkClassName}
              breakHandler={handleBreakClick.bind(null, index)}
              getEventListener={getEventListener}
            />
          )
          items.push(breakView)
        }
      }
    }

    return items
  }

  useEffect(() => {
    let initialSelected

    if (initialPage) {
      initialSelected = initialPage
    } else if (forcePage) {
      initialSelected = forcePage
    } else {
      initialSelected = 0
    }

    setCurrentSelected(initialSelected)
  }, [])

  useEffect(() => {
    // Call the callback with the initialPage item:
    if (typeof initialPage !== 'undefined' && !disableInitialCallback) {
      callCallback(initialPage)
    }

    if (extraAriaContext) {
      console.warn(
        'DEPRECATED (react-paginate): The extraAriaContext prop is deprecated. You should now use the ariaLabelBuilder instead.'
      )
    }
  }, [initialPage, extraAriaContext])

  return (
    // eslint-disable-next-line react/jsx-no-undef
    <div className='custom-pagination'>
      <div className='display-range px-1'>
        <FormattedHTMLMessage
          id='Display range of records'
          values={{
            totalRows,
            displayFrom,
            displayTo: displayTo < totalRows ? displayTo : totalRows,
            unit: displayUnit || ''
          }}
        />
      </div>

      <div className={containerClassName}>
        <div className='show'>
          <FormattedMessage id='Show' />
          &nbsp;
          <Select
            className='react-select'
            classNamePrefix='select'
            options={rowsPerPageOptions}
            value={{ label: rowsPerPage, value: rowsPerPage }}
            onChange={handlePerPage}
            menuPlacement='auto'
          />
          &nbsp;
          <FormattedMessage id='item' />
        </div>
        <ul>
          <li className={previousClasses}>
            <a
              className={previousLinkClassName}
              href={hrefBuilderCus(currentSelected - 1)}
              tabIndex='0'
              role='button'
              onKeyPress={handlePreviousPage}
              aria-disabled={previousAriaDisabled}
              aria-label={previousAriaLabel}
              rel={prevRel}
              {...getEventListener(handlePreviousPage)}
            >
              {previousLabel}
            </a>
          </li>
          <li className={previousPagesClasses}>
            <a
              className={previousPagesLinkClassName}
              href={hrefBuilderCus(currentSelected - 1)}
              tabIndex='0'
              role='button'
              onKeyPress={handlePreviousPageRange}
              aria-disabled={previousPagesAriaDisabled}
              aria-label={previousPagesAriaLabel}
              rel={prevPagesRel}
              {...getEventListener(handlePreviousPageRange)}
            >
              {previousPagesLabel}
            </a>
          </li>

          {pagination()}

          <li className={nextPagesClasses}>
            <a
              className={nextPagesLinkClassName}
              href={hrefBuilderCus(currentSelected + 1)}
              tabIndex='0'
              role='button'
              onKeyPress={handleNextPageRange}
              aria-disabled={nextPagesAriaDisabled}
              aria-label={nextPagesAriaLabel}
              rel={nextPagesRel}
              {...getEventListener(handleNextPageRange)}
            >
              {nextPagesLabel}
            </a>
          </li>
          <li className={nextClasses}>
            <a
              className={nextLinkClassName}
              href={hrefBuilderCus(currentSelected + 1)}
              tabIndex='0'
              role='button'
              onKeyPress={handleNextPage}
              aria-disabled={nextAriaDisabled}
              aria-label={nextAriaLabel}
              rel={nextRel}
              {...getEventListener(handleNextPage)}
            >
              {nextLabel}
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

CustomPagination.propTypes = {
  pageCount: PropTypes.number.isRequired,
  pageRangeDisplayed: PropTypes.number.isRequired,
  marginPagesDisplayed: PropTypes.number.isRequired,
  previousLabel: PropTypes.node,
  previousAriaLabel: PropTypes.string,
  prevRel: PropTypes.string,
  nextLabel: PropTypes.node,
  nextAriaLabel: PropTypes.string,
  nextRel: PropTypes.string,
  breakLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  hrefBuilder: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageActive: PropTypes.func,
  initialPage: PropTypes.number,
  forcePage: PropTypes.number,
  disableInitialCallback: PropTypes.bool,
  containerClassName: PropTypes.string,
  pageClassName: PropTypes.string,
  pageLinkClassName: PropTypes.string,
  pageLabelBuilder: PropTypes.func,
  activeClassName: PropTypes.string,
  activeLinkClassName: PropTypes.string,
  previousClassName: PropTypes.string,
  nextClassName: PropTypes.string,
  previousLinkClassName: PropTypes.string,
  nextLinkClassName: PropTypes.string,
  disabledClassName: PropTypes.string,
  breakClassName: PropTypes.string,
  breakLinkClassName: PropTypes.string,
  extraAriaContext: PropTypes.string,
  ariaLabelBuilder: PropTypes.func,
  eventListener: PropTypes.string,
  pageRange: PropTypes.number,
  previousPagesClassName: PropTypes.string,
  nextPagesClassName: PropTypes.string,
  previousPagesLinkClassName: PropTypes.string,
  nextPagesLinkClassName: PropTypes.string,
  previousPagesLabel: PropTypes.node,
  previousPagesAriaLabel: PropTypes.string,
  prevPagesRel: PropTypes.string,
  nextPagesLabel: PropTypes.node,
  nextPagesAriaLabel: PropTypes.string,
  nextPagesRel: PropTypes.string,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  handlePerPage: PropTypes.func,
  totalRows: PropTypes.number,
  displayUnit: PropTypes.string
}

CustomPagination.defaultProps = {
  pageCount: 10,
  pageRangeDisplayed: 2,
  marginPagesDisplayed: 3,
  activeClassName: 'selected',
  previousLabel: 'Previous',
  previousClassName: 'previous',
  previousAriaLabel: 'Previous page',
  prevRel: 'prev',
  nextLabel: 'Next',
  nextClassName: 'next',
  nextAriaLabel: 'Next page',
  nextRel: 'next',
  breakLabel: '...',
  disabledClassName: 'disabled',
  disableInitialCallback: false,
  pageLabelBuilder: (page) => page,
  eventListener: 'onClick'
}

export default CustomPagination
